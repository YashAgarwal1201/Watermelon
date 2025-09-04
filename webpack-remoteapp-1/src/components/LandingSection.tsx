import React, { useState } from "react";

const LandingSection: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [userMessage, setUserMessage] = useState(
    "Hello from Webpack React Remote!"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("features");
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter > 0 ? counter - 1 : 0);
  const reset = () => setCounter(0);

  React.useEffect(() => {
    console.log("Webpack React Remote App mounted successfully!");

    setTimeout(() => {
      setAnimationEnabled(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <header className="text-center py-8">
          <h1
            className={`text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4 ${
              animationEnabled ? "animate-pulse" : ""
            }`}
          >
            <span className="inline-block mr-3">⚛️</span>
            Webpack React Remote
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            <strong>Stack:</strong> Webpack 5 + React 18 + TypeScript + Module
            Federation + Tailwind CSS
          </p>
          <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm color-blue-800 dark:text-blue-300 px-4 py-2 rounded-full font-medium border border-blue-200 dark:border-blue-700 shadow-lg">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Federated Remote Component</span>
          </div>
        </header>

        {/* Interactive Demo Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-6 flex items-center gap-3">
            🎮 Interactive Demo
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Counter Section */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 rounded-lg border border-blue-300 dark:border-blue-700">
              <label className="block font-semibold text-blue-800 dark:text-blue-300 mb-4 text-lg">
                Counter Controls
              </label>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={decrement}
                  disabled={counter === 0}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full font-bold text-xl transition-all disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-3xl font-bold text-blue-800 dark:text-blue-300 min-w-16 text-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border-2 border-blue-400">
                  {counter}
                </span>
                <button
                  onClick={increment}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xl transition-all hover:scale-105"
                >
                  +
                </button>
              </div>
              <button
                onClick={reset}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Reset Counter
              </button>
            </div>

            {/* Message Section */}
            <div className="bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 p-6 rounded-lg border border-cyan-300 dark:border-cyan-700">
              <label className="block font-semibold text-cyan-800 dark:text-cyan-300 mb-4 text-lg">
                Dynamic Message
              </label>
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                maxLength={100}
                className="w-full p-3 border-2 border-cyan-400 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <div className="mt-4 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <p className="text-cyan-800 dark:text-cyan-300 font-medium min-h-6">
                  {userMessage}
                </p>
                <small className="text-cyan-600 dark:text-cyan-400 text-sm">
                  {userMessage.length}/100 characters
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Information Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-3">
              📋 Information Hub
            </h2>
            <div className="flex flex-wrap gap-2">
              {["features", "tech", "federation", "stats"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-64">
            {selectedTab === "features" && (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    icon: "📦",
                    title: "Webpack 5 Module Federation",
                    desc: "Runtime code sharing between applications",
                  },
                  {
                    icon: "⚛️",
                    title: "React 18 with Hooks",
                    desc: "Modern React with concurrent features",
                  },
                  {
                    icon: "🔷",
                    title: "TypeScript Support",
                    desc: "Type-safe development with IntelliSense",
                  },
                  {
                    icon: "🎨",
                    title: "Tailwind CSS Integration",
                    desc: "Utility-first styling with design system",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <span className="text-2xl flex-shrink-0">
                      {feature.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "tech" && (
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    name: "Webpack",
                    version: "5.90.0",
                    desc: "Module bundler with federation",
                  },
                  {
                    name: "React",
                    version: "18.3.1",
                    desc: "UI library for building components",
                  },
                  {
                    name: "TypeScript",
                    version: "5.2.2",
                    desc: "Typed JavaScript at scale",
                  },
                  {
                    name: "Tailwind CSS",
                    version: "3.4.0",
                    desc: "Utility-first CSS framework",
                  },
                ].map((tech, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300">
                        {tech.name}
                      </h4>
                      <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        v{tech.version}
                      </span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {tech.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "federation" && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      webpack_react_remote
                    </div>
                    <div className="text-sm text-blue-500 dark:text-blue-400">
                      Federation Name
                    </div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      ./RemoteEntry
                    </div>
                    <div className="text-sm text-cyan-500 dark:text-cyan-400">
                      Exposed Module
                    </div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      :8080
                    </div>
                    <div className="text-sm text-teal-500 dark:text-teal-400">
                      Development Port
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                    🔗 How Module Federation Works
                  </h4>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li>
                      • Webpack builds this app as a federated remote module
                    </li>
                    <li>
                      • Host applications can import and render this component
                      at runtime
                    </li>
                    <li>
                      • Shared dependencies (React, etc.) are loaded once and
                      reused
                    </li>
                    <li>
                      • Independent deployments without affecting other
                      applications
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === "stats" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: counter, label: "Current Count", color: "blue" },
                  {
                    value: userMessage.length,
                    label: "Message Length",
                    color: "cyan",
                  },
                  { value: "4", label: "Active Tabs", color: "teal" },
                  { value: "100%", label: "Federation Ready", color: "indigo" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-lg border border-${stat.color}-200 dark:border-${stat.color}-800`}
                  >
                    <div
                      className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={`text-sm text-${stat.color}-500 dark:text-${stat.color}-400`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expandable Technical Details */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-3">
              🔧 Technical Implementation
            </h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              <span>{isExpanded ? "Hide" : "Show"} Details</span>
              <span
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
          </div>

          {isExpanded && (
            <div className="grid gap-6 md:grid-cols-2 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  🏗️ Component Architecture
                </h3>
                <ul className="space-y-2 text-blue-600 dark:text-blue-400">
                  {[
                    "React functional components with hooks",
                    "TypeScript interfaces for type safety",
                    "State management with useState hook",
                    "Effect hooks for component lifecycle",
                    "Event handlers with proper typing",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                  📦 Webpack Configuration
                </h3>
                <ul className="space-y-2 text-cyan-600 dark:text-cyan-400">
                  {[
                    "ModuleFederationPlugin for remote exposure",
                    "Shared dependencies optimization",
                    "TypeScript loader with type checking",
                    "CSS modules and Tailwind integration",
                    "Development server with HMR support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">→</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Status Footer */}
        <footer className="text-center bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 rounded-xl border border-blue-300 dark:border-blue-700">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            🎉 <strong>Success:</strong> Webpack React remote component loaded
            with full module federation capabilities and isolated Tailwind
            styling
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingSection;
