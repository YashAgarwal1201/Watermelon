// File: wc-lit-app/src/wm-notification-center.ts

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

@customElement("wm-notification-center")
export class WmNotificationCenter extends LitElement {
  @property({ type: String, reflect: true })
  theme: "light" | "dark" = "light";

  @state()
  private isOpen = false;

  @state()
  private notifications: NotificationItem[] = [
    {
      id: "1",
      title: "New deployment succeeded in production",
      time: "10m ago",
      unread: true,
    },
    {
      id: "2",
      title: "Remote app angular-remoteapp updated to v20.1",
      time: "1h ago",
      unread: true,
    },
    {
      id: "3",
      title: "WatermelonBridge connection established",
      time: "2h ago",
      unread: true,
    },
  ];

  static styles = css`
    :host {
      display: inline-block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, sans-serif;
      position: relative;
      --nc-bg: #ffffff;
      --nc-text: #18181b;
      --nc-subtext: #71717a;
      --nc-border: #e4e4e7;
      --nc-badge-bg: #ef4444;
      --nc-badge-text: #ffffff;
      --nc-hover-bg: #f4f4f5;
      --nc-item-unread-bg: #eff6ff;
      --nc-btn-bg: #2563eb;
      --nc-btn-hover: #1d4ed8;
      --nc-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    :host([theme="dark"]) {
      --nc-bg: #18181b;
      --nc-text: #f4f4f5;
      --nc-subtext: #a1a1aa;
      --nc-border: #27272a;
      --nc-badge-bg: #ef4444;
      --nc-badge-text: #ffffff;
      --nc-hover-bg: #27272a;
      --nc-item-unread-bg: #1e293b;
      --nc-btn-bg: #3b82f6;
      --nc-btn-hover: #2563eb;
      --nc-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5),
        0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }

    .container {
      position: relative;
      display: inline-block;
    }

    .bell-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1px solid var(--nc-border);
      background: var(--nc-bg);
      color: var(--nc-text);
      cursor: pointer;
      transition: all 0.15s ease;
      padding: 0;
    }

    .bell-btn:hover {
      background: var(--nc-hover-bg);
    }

    .bell-icon {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--nc-badge-bg);
      color: var(--nc-badge-text);
      font-size: 11px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      box-sizing: border-box;
      line-height: 1;
    }

    .popover {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 320px;
      max-width: 90vw;
      background: var(--nc-bg);
      border: 1px solid var(--nc-border);
      border-radius: 12px;
      box-shadow: var(--nc-shadow);
      z-index: 1000;
      overflow: hidden;
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .popover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--nc-border);
    }

    .popover-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--nc-text);
      margin: 0;
    }

    .mark-read-btn {
      font-size: 12px;
      background: none;
      border: none;
      color: var(--nc-btn-bg);
      cursor: pointer;
      font-weight: 500;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .mark-read-btn:hover {
      text-decoration: underline;
    }

    .mark-read-btn:disabled {
      color: var(--nc-subtext);
      cursor: not-allowed;
      text-decoration: none;
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 280px;
      overflow-y: auto;
    }

    .item {
      padding: 12px 16px;
      border-bottom: 1px solid var(--nc-border);
      transition: background 0.15s ease;
      cursor: default;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item.unread {
      background: var(--nc-item-unread-bg);
    }

    .item:hover {
      background: var(--nc-hover-bg);
    }

    .item-title {
      font-size: 13px;
      color: var(--nc-text);
      margin: 0 0 4px 0;
      line-height: 1.4;
      font-weight: 500;
    }

    .item-time {
      font-size: 11px;
      color: var(--nc-subtext);
      margin: 0;
    }

    .empty-state {
      padding: 24px 16px;
      text-align: center;
      color: var(--nc-subtext);
      font-size: 13px;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchBadgeCount();
    window.addEventListener("click", this.handleOutsideClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("click", this.handleOutsideClick);
  }

  private handleOutsideClick = (e: MouseEvent) => {
    // Check if clicked outside this custom element's shadow boundary
    if (!e.composedPath().includes(this)) {
      this.isOpen = false;
    }
  };

  private get unreadCount(): number {
    return this.notifications.filter((n) => n.unread).length;
  }

  private toggleDropdown(e: Event) {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  private markAllAsRead(e: Event) {
    e.stopPropagation();
    this.notifications = this.notifications.map((n) => ({
      ...n,
      unread: false,
    }));
    this.dispatchBadgeCount();
  }

  private dispatchBadgeCount() {
    this.dispatchEvent(
      new CustomEvent("wm-badge-count", {
        detail: { count: this.unreadCount },
        bubbles: true,
        composed: true, // Crucial: crosses the Shadow DOM boundary to the host shell
      }),
    );
  }

  render() {
    const unread = this.unreadCount;

    return html`
      <div class="container">
        <button
          class="bell-btn"
          @click=${this.toggleDropdown}
          aria-label="Notifications"
          title="Notifications"
        >
          <svg class="bell-icon" viewBox="0 0 24 24">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            ></path>
          </svg>
          ${unread > 0 ? html`<span class="badge">${unread}</span>` : ""}
        </button>

        ${this.isOpen
          ? html`
              <div class="popover">
                <div class="popover-header">
                  <h4 class="popover-title">Notifications</h4>
                  <button
                    class="mark-read-btn"
                    @click=${this.markAllAsRead}
                    ?disabled=${unread === 0}
                  >
                    Mark all read
                  </button>
                </div>

                <ul class="list">
                  ${this.notifications.map(
                    (n) => html`
                      <li class="item ${n.unread ? "unread" : ""}">
                        <p class="item-title">${n.title}</p>
                        <p class="item-time">${n.time}</p>
                      </li>
                    `,
                  )}
                </ul>
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wm-notification-center": WmNotificationCenter;
  }
}
