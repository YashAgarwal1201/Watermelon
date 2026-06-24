import { Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Overview" },
  { to: "/sub-page-1", label: "Characters" },
  { to: "/sub-page-2", label: "Random" },
];

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="w-full h-14 flex items-center justify-between px-6 gap-6">
      {/* Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <Zap
          size={16}
          className="text-amber-400 fill-amber-400"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold tracking-widest text-amber-400 uppercase">
          Star Wars Quotes
        </span>
      </div>

      {/* Nav */}
      <nav aria-label="Remote navigation">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-400/10 text-amber-300"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
