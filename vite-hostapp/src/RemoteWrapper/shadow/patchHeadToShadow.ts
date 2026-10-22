// File: RemoteWrapper/shadow/patchHeadToShadow.ts

// ─── CSS Head → Shadow DOM Interception ───────────────────────────────────────
// Bundlers (Vite, Webpack style-loader, Angular) inject <style> and <link> tags
// into document.head at runtime. Since remotes are mounted inside a Shadow DOM,
// those global styles are invisible to the remote's DOM tree.
//
// This module intercepts every head insertion method and diverts style/link
// nodes into the remote's shadow root instead.
//
// The interceptor is scoped to a single remoteName and cancellation check so it
// automatically becomes a no-op as soon as isCancelled() is true.
// ──────────────────────────────────────────────────────────────────────────────

import { getOrCreateBucket } from "./cssCache";

function isStyleOrLink(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return false;
  const t = node.tagName.toLowerCase();
  return (
    t === "style" ||
    (t === "link" && (node as HTMLLinkElement).rel === "stylesheet")
  );
}

export function patchHeadToShadow(
  shadow: ShadowRoot,
  remoteName: string,
  isCancelled: () => boolean = () => false,
): () => void {
  const head = document.head as any;
  const origAppendChild = head.appendChild.bind(head);
  const origInsertBefore = head.insertBefore.bind(head);
  const origAppend = head.append?.bind(head);
  const origPrepend = head.prepend?.bind(head);
  const origInsertAdjacentElement = head.insertAdjacentElement?.bind(head);
  const origInsertAdjacentHTML = head.insertAdjacentHTML?.bind(head);

  const bucket = getOrCreateBucket(remoteName);

  async function fetchAndInject(href: string) {
    try {
      const res = await fetch(href, { mode: "cors", cache: "force-cache" });
      if (!res.ok) return;
      const css = await res.text();
      if (isCancelled()) return;
      const s = document.createElement("style");
      s.setAttribute("data-remote-src", href);
      s.textContent = css;
      shadow.appendChild(s);
      if (!bucket.includes(css)) bucket.push(css);
    } catch {}
  }

  function intercept(node: Node): boolean {
    if (!isStyleOrLink(node)) return false;
    if (isCancelled()) return false;

    if (node instanceof HTMLElement && node.tagName.toLowerCase() === "style") {
      const clone = document.createElement("style");
      clone.setAttribute("data-remote-css", remoteName);
      clone.textContent = node.textContent ?? "";
      shadow.appendChild(clone);

      // Push a placeholder and update it in-place as style-loader / Angular
      // fills the node content asynchronously after appendChild.
      const bucketIndex = bucket.length;
      bucket.push(node.textContent ?? "");

      new MutationObserver(() => {
        const css = node.textContent ?? "";
        clone.textContent = css;
        bucket[bucketIndex] = css;
      }).observe(node, { characterData: true, childList: true, subtree: true });

      return true;
    }

    if (node instanceof HTMLLinkElement && node.rel === "stylesheet") {
      void fetchAndInject(node.href);
      return true;
    }

    return false;
  }

  head.appendChild = function <T extends Node>(node: T): T {
    if (intercept(node)) return node;
    return origAppendChild(node);
  };

  head.insertBefore = function <T extends Node>(node: T, ref: Node | null): T {
    if (intercept(node)) return node;
    return origInsertBefore(node, ref);
  };

  if (origAppend) {
    head.append = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (typeof n !== "string" && intercept(n)) continue;
        origAppend(n);
      }
    };
  }

  if (origPrepend) {
    head.prepend = function (...nodes: (Node | string)[]) {
      for (const n of nodes) {
        if (typeof n !== "string" && intercept(n)) continue;
        origPrepend(n);
      }
    };
  }

  if (origInsertAdjacentElement) {
    head.insertAdjacentElement = function (
      position: InsertPosition,
      el: Element,
    ): Element | null {
      if (intercept(el)) return el;
      return origInsertAdjacentElement(position, el);
    };
  }

  if (origInsertAdjacentHTML) {
    head.insertAdjacentHTML = function (
      position: InsertPosition,
      html: string,
    ) {
      // Parse the HTML string, intercept any style/link nodes,
      // and only forward non-style/link content to the real head.
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const remaining: string[] = [];
      for (const child of Array.from(tmp.children)) {
        if (!intercept(child)) {
          remaining.push(child.outerHTML);
        }
      }
      if (remaining.length) {
        origInsertAdjacentHTML(position, remaining.join(""));
      }
    };
  }

  const mo = new MutationObserver((records) => {
    for (const r of records)
      for (const n of Array.from(r.addedNodes))
        if (isStyleOrLink(n)) intercept(n);
  });
  mo.observe(document.head, { childList: true });

  // Returns a restore function: call on unmount or before next loadRemote()
  return () => {
    mo.disconnect();
    head.appendChild = origAppendChild;
    head.insertBefore = origInsertBefore;
    if (origAppend) head.append = origAppend;
    if (origPrepend) head.prepend = origPrepend;
    if (origInsertAdjacentElement)
      head.insertAdjacentElement = origInsertAdjacentElement;
    if (origInsertAdjacentHTML)
      head.insertAdjacentHTML = origInsertAdjacentHTML;
  };
}
