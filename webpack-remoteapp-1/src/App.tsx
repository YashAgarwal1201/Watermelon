import React from "react";
// import Dashboard from '@/components/Dashboard/Dashboard';
import "./index.css";
import LandingSection from "./components/LandingSection";

const App: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-100">
      <LandingSection />
    </div>
  );
};

export default App;
