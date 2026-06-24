// Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

export default function Layout() {
  return (
    <div className="w-full h-full flex flex-col bg-gray-950 text-white">
      <div className="w-full shrink-0 border-b border-white/8">
        <Header />
      </div>
      <div className="grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
