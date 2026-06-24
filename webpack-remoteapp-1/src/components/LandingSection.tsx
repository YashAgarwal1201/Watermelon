import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shuffle, ChevronRight, Quote } from "lucide-react";
import {
  randomQuote,
  getCharacter,
  QUOTES,
  CHARACTERS,
  SIDE_STYLES,
  type Quote as TQuote,
} from "../data/quotes";

const SECTION_CARDS = [
  {
    to: "/sub-page-1",
    icon: Users,
    title: "Browse by Character",
    desc: "Filter the full quote archive by character across all eras.",
    accent: "text-blue-400",
    border: "border-blue-500/25 hover:border-blue-500/60",
    bg: "hover:bg-blue-500/5",
  },
  {
    to: "/sub-page-2",
    icon: Shuffle,
    title: "Random Quote",
    desc: "Draw a quote at random and save your favourites.",
    accent: "text-amber-400",
    border: "border-amber-500/25 hover:border-amber-500/60",
    bg: "hover:bg-amber-500/5",
  },
];

const LandingSection: React.FC = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<TQuote>(() => randomQuote());

  // Rotate featured quote every 8 s
  useEffect(() => {
    const id = setInterval(() => setFeatured(randomQuote()), 8000);
    return () => clearInterval(id);
  }, []);

  const character = getCharacter(featured.characterId);
  const sideStyle = character
    ? SIDE_STYLES[character.side]
    : SIDE_STYLES.neutral;

  return (
    <div className="w-full min-h-full px-6 py-12 max-w-4xl mr-auto space-y-14">
      {/* ── Hero ── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Webpack · React · TypeScript · Tailwind v4
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Quotes from a <span className="text-amber-400">galaxy far,</span>
          <br />
          far away.
        </h1>
        <p className="text-base text-gray-400 max-w-lg leading-relaxed">
          {QUOTES.length} quotes across {CHARACTERS.length} characters from the
          Star Wars universe — a federated React remote loaded at runtime by the
          Watermelon host.
        </p>
      </section>

      {/* ── Featured quote (auto-rotating) ── */}
      <section aria-label="Featured quote" className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Featured
        </p>
        <div
          className={[
            "rounded-xl border p-6 space-y-4 transition-colors duration-500",
            sideStyle.border,
          ].join(" ")}
        >
          <Quote
            size={20}
            className={`${sideStyle.accent} opacity-60`}
            aria-hidden="true"
          />
          <blockquote>
            <p className="text-xl md:text-2xl font-medium text-white leading-snug">
              "{featured.text}"
            </p>
          </blockquote>
          <footer className="flex items-center gap-3 flex-wrap">
            {character && (
              <span className={`text-sm font-semibold ${sideStyle.accent}`}>
                {character.name}
              </span>
            )}
            <span className="text-gray-600 text-sm hidden sm:inline">·</span>
            <span className="text-sm text-gray-500 italic">
              {featured.source}
            </span>
            {character && (
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full ${sideStyle.badge} capitalize`}
              >
                {character.side === "light"
                  ? "Light Side"
                  : character.side === "dark"
                    ? "Dark Side"
                    : "Neutral"}
              </span>
            )}
          </footer>
        </div>
        <p className="text-xs text-gray-600 pl-1">Rotates every 8 seconds</p>
      </section>

      {/* ── Navigation cards ── */}
      <section aria-label="Sections" className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Explore
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SECTION_CARDS.map(
            ({ to, icon: Icon, title, desc, accent, border, bg }) => (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                className={[
                  "group text-left rounded-xl border p-5 space-y-3 transition-all cursor-pointer",
                  border,
                  bg,
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <Icon size={20} className={accent} aria-hidden="true" />
                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className={`text-base font-semibold ${accent}`}>
                    {title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </button>
            ),
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingSection;
