import React from "react";
// import Dashboard from '@/components/Dashboard/Dashboard';
import "./index.css";
import LandingSection from "./components/LandingSection";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SubPage1 from "./components/SubPages/SubPage1";
import SubPage2 from "./components/SubPages/SubPage2";

declare global {
  interface Window {
    BASENAME?: string;
  }
}

const App: React.FC = () => {
  const basename = window.BASENAME || "/";
  return (
    <div className="w-full h-full bg-gray-100">
      {/* <LandingSection /> */}
      <BrowserRouter basename={basename ?? "remote/webpack_react_remoteapp"}>
        <Routes>
          {/* Wrap with a layout (header/footer shared) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingSection />} />
            <Route path="sub-page-1" element={<SubPage1 />} />
            <Route path="sub-page-2" element={<SubPage2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
