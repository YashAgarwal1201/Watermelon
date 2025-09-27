import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Home = () => {
  const [counter, setCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [
    { name: "React 18", version: "18.3.1", status: "Active" },
    { name: "TypeScript", version: "5.2.2", status: "Active" },
    { name: "Vite", version: "5.1.0", status: "Active" },
    { name: "PrimeReact", version: "10.6.6", status: "Active" },
  ];

  const federationStats = [
    { label: "Bundle Size", value: "45KB", icon: "pi-file" },
    { label: "Load Time", value: "120ms", icon: "pi-clock" },
    { label: "Components", value: "12", icon: "pi-th-large" },
  ];

  return (
    <div className="w-full h-full p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <i className="pi pi-code text-4xl text-blue-600"></i>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              React Remote App
            </h1>
            <Badge
              value="Remote #1"
              severity="info"
              className="text-sm"
            ></Badge>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            This is a federated React application built with Vite, TypeScript,
            and PrimeReact. It demonstrates micro-frontend architecture in
            action.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card
            title="🚀 Welcome to Remote App"
            className="col-span-1 lg:col-span-2 shadow-lg border border-blue-200 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This remote application is independently developed and deployed,
                yet seamlessly integrated into the host application through
                Module Federation. Click the button below to test interactivity!
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  label={`Clicked ${counter} times`}
                  icon="pi pi-plus"
                  onClick={() => setCounter((c) => c + 1)}
                  className="p-button-info p-button-raised"
                />
                <Button
                  label="Reset"
                  icon="pi pi-refresh"
                  onClick={() => setCounter(0)}
                  severity="secondary"
                  outlined
                />
              </div>

              {counter > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="pi pi-info-circle text-blue-600"></i>
                    <span className="font-semibold text-blue-800">
                      Interaction Success!
                    </span>
                  </div>
                  <p className="text-blue-700">
                    State management is working perfectly within this federated
                    component.
                  </p>
                  <ProgressBar
                    value={(counter * 10) % 100}
                    className="mt-2"
                  ></ProgressBar>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Card */}
          <Card
            title="📊 App Statistics"
            className="shadow-lg border border-cyan-200 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-4">
              {federationStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200"
                >
                  <div className="flex items-center gap-3">
                    <i className={`pi ${stat.icon} text-cyan-600 text-xl`}></i>
                    <span className="font-medium text-gray-700">
                      {stat.label}
                    </span>
                  </div>
                  <Chip
                    label={stat.value}
                    className="bg-cyan-100 text-cyan-800"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Technology Stack */}
        <Panel
          header="🛠️ Technology Stack"
          toggleable
          collapsed={!isExpanded}
          onToggle={(e) => setIsExpanded(e.value)}
          className="shadow-lg border border-blue-200 bg-white/80 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <i className="pi pi-cog text-white text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {feature.name}
                    </h4>
                    <p className="text-sm text-gray-600">v{feature.version}</p>
                    <Badge
                      value={feature.status}
                      severity="success"
                      className="text-xs mt-1"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Panel>

        <Divider />

        {/* Federation Info */}
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="pi pi-sitemap text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                Module Federation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">
                    Federation Name:
                  </span>
                  <p className="text-gray-700">vite_react_remoteapp</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">
                    Exposed Modules:
                  </span>
                  <p className="text-gray-700">./ViteReactRemoteComponent</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">
                    Shared Dependencies:
                  </span>
                  <p className="text-gray-700">react, react-dom</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <i className="pi pi-lightbulb mr-2"></i>
                  <strong>Pro Tip:</strong> This component can be consumed by
                  any host application that supports Module Federation,
                  regardless of the host's framework!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-blue-200">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <i className="pi pi-heart-fill text-red-500"></i>
            Built with React + Vite + PrimeReact
            <i className="pi pi-heart-fill text-red-500"></i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
