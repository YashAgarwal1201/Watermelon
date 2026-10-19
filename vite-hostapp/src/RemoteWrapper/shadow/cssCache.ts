// File: RemoteWrapper/shadow/cssCache.ts

// ─── MODULE-LEVEL CSS cache ────────────────────────────────────────────────────
// Lives at module scope (not component scope) so it survives across component
// mount/unmount cycles. Navigating away from a remote destroys its component
// instance — if this were inside <script setup>, the cache would be lost on
// the way back and replayCssIntoShadow would have nothing to replay.
// ──────────────────────────────────────────────────────────────────────────────

export const cssCache = new Map<string, string[]>();

/** Ensure a bucket exists for the given remote and return it. */
export function getOrCreateBucket(remoteName: string): string[] {
  if (!cssCache.has(remoteName)) cssCache.set(remoteName, []);
  return cssCache.get(remoteName)!;
}

/** Replay all cached CSS strings into a (newly constructed) shadow root. */
export function replayCssIntoShadow(remoteName: string, shadow: ShadowRoot): void {
  const bucket = cssCache.get(remoteName);
  if (!bucket?.length) return;
  for (const css of bucket) {
    const s = document.createElement("style");
    s.setAttribute("data-remote-css-replay", remoteName);
    s.textContent = css;
    shadow.appendChild(s);
  }
}
