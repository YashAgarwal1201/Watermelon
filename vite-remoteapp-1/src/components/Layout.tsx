// Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="w-full h-full flex flex-col  bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="w-full h-16 flex-shrink-0">
        <Header />
      </div>
      <div className="flex-grow-1 overflow-y-auto">
        {/* 'Outlet' renders child route */}
        <Outlet />
      </div>
    </div>
  );
}
