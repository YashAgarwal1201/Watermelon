// File: RemoteWrapper/shadow/buildShadow.ts

// ─── Shadow DOM Construction & Host CSS Variable Injection ───────────────────
// Creates or recycles an open shadow root attached to hostEl, empties it if
// reused, forwards all computed CSS custom properties (--*) from document.documentElement
// into :host, and appends a full-size mount container.
// ──────────────────────────────────────────────────────────────────────────────

export function buildShadow(
  hostEl: HTMLElement,
  existingShadow: ShadowRoot | null,
  appName: string = "",
): { shadow: ShadowRoot; mount: HTMLElement } {
  let shadow: ShadowRoot;
  if (existingShadow) {
    shadow = existingShadow;
    while (shadow.firstChild) {
      shadow.removeChild(shadow.firstChild);
    }
  } else {
    shadow = hostEl.attachShadow({ mode: "open" });
  }

  try {
    const computed = getComputedStyle(document.documentElement);
    let vars = ":host{";
    for (let i = 0; i < computed.length; i++) {
      const p = computed[i];
      if (p?.startsWith("--")) {
        vars += `${p}:${computed.getPropertyValue(p)};`;
      }
    }
    vars += "}";
    const varStyle = document.createElement("style");
    varStyle.textContent = vars;
    shadow.appendChild(varStyle);
  } catch {}

  const mount = document.createElement("div");
  mount.style.cssText = "width:100%;height:100%;display:contents;";
  mount.setAttribute("data-remote-mount", appName || "");
  shadow.appendChild(mount);

  return { shadow, mount };
}
