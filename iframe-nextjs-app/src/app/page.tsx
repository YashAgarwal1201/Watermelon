// File: iframe-nextjs-app/src/app/page.tsx
"use client";

import React, { useState, useEffect, useMemo, Component, type ErrorInfo, type ReactNode } from "react";
import { WatermelonBridgeClient } from "@watermelon/bridge";

// ─── Crash Isolation Error Boundary ──────────────────────────────────────────
class RemoteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[iframe-nextjs-app] Caught by internal ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-box">
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🛡️</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: "0 0 8px 0" }}>
            Simulated Remote Exception Caught
          </h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 16px auto", fontSize: "0.9rem" }}>
            This error was contained inside the <code>iframe-nextjs-app</code> frame.
            The Vue 3 host shell, navigation bar, and state remain responsive and unaffected.
          </p>
          <pre style={{
            background: "rgba(0,0,0,0.1)",
            padding: "8px 16px",
            borderRadius: "8px",
            display: "inline-block",
            fontSize: "0.85rem",
            marginBottom: "16px"
          }}>
            {this.state.error?.message}
          </pre>
          <div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Recover Remote
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Analytics Metrics Data ───────────────────────────────────────────────────
type TimeRange = "24h" | "7d" | "30d" | "90d";

interface MetricData {
  sessions: string;
  latency: string;
  messages: string;
  efficiency: string;
  mfShare: number;
  wcShare: number;
  iframeShare: number;
}

const METRICS_BY_RANGE: Record<TimeRange, MetricData> = {
  "24h": {
    sessions: "34,120",
    latency: "3.2 ms",
    messages: "482,100",
    efficiency: "+18.4%",
    mfShare: 52,
    wcShare: 28,
    iframeShare: 20,
  },
  "7d": {
    sessions: "142,890",
    latency: "3.5 ms",
    messages: "2.1M",
    efficiency: "+14.2%",
    mfShare: 50,
    wcShare: 30,
    iframeShare: 20,
  },
  "30d": {
    sessions: "528,400",
    latency: "3.4 ms",
    messages: "8.6M",
    efficiency: "+16.8%",
    mfShare: 48,
    wcShare: 32,
    iframeShare: 20,
  },
  "90d": {
    sessions: "1,890,200",
    latency: "3.8 ms",
    messages: "24.2M",
    efficiency: "+21.0%",
    mfShare: 45,
    wcShare: 33,
    iframeShare: 22,
  },
};

function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [activeCard, setActiveCard] = useState<string>("sessions");
  const [lastEmitted, setLastEmitted] = useState<string | null>(null);
  const [shouldCrash, setShouldCrash] = useState(false);

  // Initialize WatermelonBridge client
  const bridge = useMemo(
    () => new WatermelonBridgeClient({ remoteId: "iframe_nextjs_app" }),
    []
  );

  useEffect(() => {
    // 1. Signal ready state to host
    bridge.ready();

    // 2. Automatically synchronize iframe height with host container
    const unobserve = bridge.observeResize(document.body);

    // 3. Synchronize theme with host
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

  // Handle Range Filter change
  const handleRangeChange = (newRange: TimeRange) => {
    setRange(newRange);
    const eventDetail = `ANALYTICS_FILTER_CHANGED: range="${newRange}"`;
    setLastEmitted(eventDetail);

    // Emit event across postMessage bridge to host
    bridge.emit("ANALYTICS_FILTER_CHANGED", {
      range: newRange,
      timestamp: Date.now(),
      metrics: METRICS_BY_RANGE[newRange],
    });
  };

  // Test crash simulation
  if (shouldCrash) {
    throw new Error("Simulated unhandled exception inside iframe-nextjs-app!");
  }

  const current = METRICS_BY_RANGE[range];

  return (
    <div className="dashboard-container">
      {/* ── Header ── */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "20px",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ marginBottom: "8px" }}>
            <span className="badge-tag">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }}></span>
              Iframe Paradigm Remote (Next.js 16 App Router + Turbopack)
            </span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 6px 0" }}>
            Analytics & Telemetry Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Server-side rendered microfrontend sandbox communicating with host shell via <code>@watermelon/bridge</code> on port <code>5301</code>.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Time Range Selector */}
          <div style={{
            display: "inline-flex",
            background: "var(--bg-secondary)",
            padding: "3px",
            borderRadius: "10px",
            border: "1px solid var(--border)"
          }}>
            {(["24h", "7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                style={{
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "7px",
                  fontSize: "0.85rem",
                  fontWeight: range === r ? "600" : "400",
                  background: range === r ? "var(--bg-card)" : "transparent",
                  color: range === r ? "var(--accent)" : "var(--text-secondary)",
                  boxShadow: range === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Crash button for testing isolation */}
          <button
            onClick={() => setShouldCrash(true)}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
            title="Demonstrate that an iframe crash will NOT affect the host shell"
          >
            Simulate Remote Crash
          </button>
        </div>
      </header>

      {/* ── Host Event Notification Banner ── */}
      {lastEmitted && (
        <div className="event-banner">
          <span style={{ fontWeight: "600" }}>Bridge PostMessage Emitted:</span>
          <code>{lastEmitted}</code>
        </div>
      )}

      {/* ── KPI Metrics Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "28px"
      }}>
        {/* Card 1: Sessions */}
        <div
          className={`kpi-card ${activeCard === "sessions" ? "active" : ""}`}
          onClick={() => setActiveCard("sessions")}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Active Remote Sessions
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "4px" }}>
            {current.sessions}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600" }}>
            ↑ {current.efficiency} vs previous period
          </div>
        </div>

        {/* Card 2: Latency */}
        <div
          className={`kpi-card ${activeCard === "latency" ? "active" : ""}`}
          onClick={() => setActiveCard("latency")}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Avg Cross-Runtime Latency
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "4px" }}>
            {current.latency}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600" }}>
            ✓ Asynchronous event dispatch
          </div>
        </div>

        {/* Card 3: PostMessages */}
        <div
          className={`kpi-card ${activeCard === "messages" ? "active" : ""}`}
          onClick={() => setActiveCard("messages")}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Bridge Routed Messages
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "4px" }}>
            {current.messages}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: "600" }}>
            ● Bridge synchronized
          </div>
        </div>

        {/* Card 4: Isolation */}
        <div
          className={`kpi-card ${activeCard === "isolation" ? "active" : ""}`}
          onClick={() => setActiveCard("isolation")}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Process Security Isolation
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#10b981", marginBottom: "4px" }}>
            Fully Sandboxed
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            No window/DOM pollution
          </div>
        </div>
      </div>

      {/* ── Architecture Tradeoff Comparison Breakdown ── */}
      <section style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "var(--card-shadow)"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 6px 0" }}>
            Multi-Runtime Performance & Traffic Distribution
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Telemetry comparing runtime overhead across Watermelon's 3 microfrontend integration strategies.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Runtime 1: Module Federation */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: "600" }}>1. Module Federation (React, Vue, Svelte, SolidJS)</span>
              <span style={{ color: "var(--text-secondary)" }}>{current.mfShare}% traffic · 1.8ms avg</span>
            </div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${current.mfShare}%`, background: "#3b82f6" }}></div>
            </div>
          </div>

          {/* Runtime 2: Web Components */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: "600" }}>2. W3C Web Components (Angular 20, Lit 3, Vue CE)</span>
              <span style={{ color: "var(--text-secondary)" }}>{current.wcShare}% traffic · 2.4ms avg</span>
            </div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${current.wcShare}%`, background: "#a855f7" }}></div>
            </div>
          </div>

          {/* Runtime 3: Sandboxed Iframes */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
              <span style={{ fontWeight: "600" }}>3. Sandboxed Iframes (Vite React 19, Next.js 16)</span>
              <span style={{ color: "var(--text-secondary)" }}>{current.iframeShare}% traffic · 3.5ms avg</span>
            </div>
            <div className="chart-bar-bg">
              <div className="chart-bar-fill" style={{ width: `${current.iframeShare}%`, background: "#f59e0b" }}></div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "12px",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div>
            💡 <strong>Architecture Note:</strong> Iframes provide true physical memory & process isolation at the cost of ~1.7ms bridge latency.
          </div>
          <span style={{ fontWeight: "600", color: "var(--accent)" }}>
            Filter Selected: {range.toUpperCase()}
          </span>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <RemoteErrorBoundary>
      <AnalyticsDashboard />
    </RemoteErrorBoundary>
  );
}
