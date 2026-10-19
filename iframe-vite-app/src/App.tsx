// File: iframe-vite-app/src/App.tsx

import React, { useState, useEffect, useMemo, Component, type ErrorInfo, type ReactNode } from "react";
import { WatermelonBridgeClient } from "@watermelon/bridge";
import "./App.css";

// ─── Crash Isolation Error Boundary ──────────────────────────────────────────
class RemoteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[iframe-vite-app] Caught by internal ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-boundary">
          <div className="crash-icon">💥</div>
          <h3>Simulated Remote Exception Caught</h3>
          <p className="crash-desc">
            This exception was thrown inside the <code>iframe-vite-app</code> sandbox.
            Notice that the host shell and navigation are completely unaffected!
          </p>
          <pre className="crash-stack">{this.state.error?.message}</pre>
          <button className="btn btn-primary" onClick={() => this.setState({ hasError: false, error: null })}>
            Recover Remote
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Mock Asset Data ──────────────────────────────────────────────────────────
interface Asset {
  id: string;
  name: string;
  type: "image" | "document" | "video" | "code" | "archive";
  size: string;
  updatedAt: string;
  dimensions?: string;
  description: string;
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: "asset_01",
    name: "hero-banner-v2.webp",
    type: "image",
    size: "1.4 MB",
    updatedAt: "2 hours ago",
    dimensions: "1920x1080",
    description: "Primary marketing landing hero illustration with alpha channel.",
  },
  {
    id: "asset_02",
    name: "system-architecture.svg",
    type: "image",
    size: "340 KB",
    updatedAt: "Yesterday",
    dimensions: "Vector",
    description: "Vector export of multi-runtime microfrontend topologies.",
  },
  {
    id: "asset_03",
    name: "watermelon-specs.pdf",
    type: "document",
    size: "4.8 MB",
    updatedAt: "Oct 19, 2026",
    description: "Full architectural specification and security policy documentation.",
  },
  {
    id: "asset_04",
    name: "brand-palette.json",
    type: "code",
    size: "12 KB",
    updatedAt: "Oct 18, 2026",
    description: "Standard design tokens and HSL hex variables.",
  },
  {
    id: "asset_05",
    name: "product-walkthrough.mp4",
    type: "video",
    size: "38.2 MB",
    updatedAt: "3 days ago",
    dimensions: "1080p 60fps",
    description: "High-definition recorded walkthrough of federated modules.",
  },
  {
    id: "asset_06",
    name: "user-avatar-default.png",
    type: "image",
    size: "48 KB",
    updatedAt: "Last week",
    dimensions: "256x256",
    description: "Fallback user avatar portrait icon.",
  },
  {
    id: "asset_07",
    name: "q3-analytics-export.csv",
    type: "document",
    size: "620 KB",
    updatedAt: "Oct 15, 2026",
    description: "Raw session telemetry and cross-runtime latency metrics.",
  },
  {
    id: "asset_08",
    name: "production-bundle.zip",
    type: "archive",
    size: "14.2 MB",
    updatedAt: "Oct 10, 2026",
    description: "Zipped bundle containing pre-built remote dist packages.",
  },
];

function AssetManager() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [lastEmitted, setLastEmitted] = useState<string | null>(null);
  const [viewDetailId, setViewDetailId] = useState<string | null>(null);
  const [shouldCrash, setShouldCrash] = useState(false);

  // Initialize WatermelonBridge
  const bridge = useMemo(() => new WatermelonBridgeClient({ remoteId: "iframe_vite_app" }), []);

  useEffect(() => {
    // 1. Signal ready state to host
    bridge.ready();

    // 2. Automatically observe layout/DOM changes and synchronize iframe height
    const unobserve = bridge.observeResize(document.body);

    // 3. Listen to host theme changes
    const unsubTheme = bridge.onTheme((theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    });

    return () => {
      unobserve();
      unsubTheme();
      bridge.destroy();
    };
  }, [bridge]);

  // Throw to test crash isolation if requested
  if (shouldCrash) {
    throw new Error("Simulated unhandled exception inside iframe-vite-app!");
  }

  const filteredAssets = useMemo(() => {
    return INITIAL_ASSETS.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "all" || a.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [search, activeTab]);

  const activeDetailAsset = useMemo(() => {
    return INITIAL_ASSETS.find((a) => a.id === viewDetailId) || null;
  }, [viewDetailId]);

  const handleSelectAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAsset(asset);
    setLastEmitted(`ASSET_SELECTED: "${asset.name}" (${asset.id})`);

    // Emit typed domain event to host via WatermelonBridge
    bridge.emit("ASSET_SELECTED", {
      id: asset.id,
      name: asset.name,
      size: asset.size,
      type: asset.type,
      timestamp: Date.now(),
    });
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "image": return "badge-blue";
      case "document": return "badge-purple";
      case "video": return "badge-amber";
      case "code": return "badge-emerald";
      case "archive": return "badge-zinc";
      default: return "";
    }
  };

  return (
    <div className="asset-manager">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-info">
          <div className="badge-pill">
            <span className="dot"></span>
            Iframe Paradigm Remote (React 19 + Vite)
          </div>
          <h1>Asset / Media Manager</h1>
          <p className="subtitle">
            Demonstrates isolated client-side routing, bridge auto-resizing, and crash protection on port <code>5300</code>.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-danger"
            onClick={() => setShouldCrash(true)}
            title="Demonstrate that an iframe crash will NOT affect the host shell"
          >
            Simulate Remote Crash
          </button>
        </div>
      </header>

      {/* ── Host Event Notification ── */}
      {lastEmitted && (
        <div className="event-banner">
          <span className="event-label">Bridge PostMessage Emitted:</span>
          <code>{lastEmitted}</code>
        </div>
      )}

      {/* ── Internal Route: Detail View ── */}
      {activeDetailAsset ? (
        <div className="detail-view">
          <div className="detail-header">
            <button className="btn btn-secondary" onClick={() => setViewDetailId(null)}>
              ← Back to Asset Grid
            </button>
            <span className="route-indicator">Internal Route: <code>/detail/{activeDetailAsset.id}</code></span>
          </div>

          <div className="detail-card">
            <div className="detail-preview">
              <span className="large-icon">
                {activeDetailAsset.type === "image" && "🖼️"}
                {activeDetailAsset.type === "document" && "📄"}
                {activeDetailAsset.type === "video" && "🎥"}
                {activeDetailAsset.type === "code" && "💻"}
                {activeDetailAsset.type === "archive" && "📦"}
              </span>
            </div>
            <div className="detail-body">
              <div className="detail-title-row">
                <h2>{activeDetailAsset.name}</h2>
                <span className={`badge ${getBadgeColor(activeDetailAsset.type)}`}>
                  {activeDetailAsset.type}
                </span>
              </div>
              <p className="detail-desc">{activeDetailAsset.description}</p>

              <dl className="meta-grid">
                <div>
                  <dt>File Size</dt>
                  <dd>{activeDetailAsset.size}</dd>
                </div>
                <div>
                  <dt>Last Modified</dt>
                  <dd>{activeDetailAsset.updatedAt}</dd>
                </div>
                {activeDetailAsset.dimensions && (
                  <div>
                    <dt>Resolution</dt>
                    <dd>{activeDetailAsset.dimensions}</dd>
                  </div>
                )}
                <div>
                  <dt>Asset ID</dt>
                  <dd><code>{activeDetailAsset.id}</code></dd>
                </div>
              </dl>

              <div className="detail-actions">
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleSelectAsset(activeDetailAsset, e)}
                >
                  {selectedAsset?.id === activeDetailAsset.id ? "✓ Currently Selected" : "Select This Asset for Host"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Internal Route: Grid View ── */
        <div className="grid-view">
          {/* Controls Bar */}
          <div className="controls-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search assets by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="type-tabs">
              {["all", "image", "document", "video", "code", "archive"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Assets Grid */}
          <div className="assets-grid">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  className={`asset-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setViewDetailId(asset.id)}
                  title="Click to view details (internal routing demonstration)"
                >
                  <div className="card-top">
                    <span className="type-icon">
                      {asset.type === "image" && "🖼️"}
                      {asset.type === "document" && "📄"}
                      {asset.type === "video" && "🎥"}
                      {asset.type === "code" && "💻"}
                      {asset.type === "archive" && "📦"}
                    </span>
                    <span className={`badge ${getBadgeColor(asset.type)}`}>
                      {asset.type}
                    </span>
                  </div>

                  <h4 className="asset-title">{asset.name}</h4>
                  <p className="asset-snippet">{asset.description}</p>

                  <div className="card-footer">
                    <span className="file-size">{asset.size}</span>
                    <button
                      className={`btn btn-sm ${isSelected ? "btn-selected" : "btn-primary"}`}
                      onClick={(e) => handleSelectAsset(asset, e)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="empty-state">
              <p>No assets matched "{search}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RemoteErrorBoundary>
      <AssetManager />
    </RemoteErrorBoundary>
  );
}
