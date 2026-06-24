import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Quote } from "lucide-react";
import {
  CHARACTERS,
  QUOTES,
  getCharacter,
  getQuotesByCharacter,
  SIDE_STYLES,
  type Character,
} from "./../../data/quotes";

const SideBadge: React.FC<{ side: Character["side"] }> = ({ side }) => {
  const styles = SIDE_STYLES[side];
  const label =
    side === "light" ? "Light Side" : side === "dark" ? "Dark Side" : "Neutral";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${styles.badge} capitalize`}
    >
      {label}
    </span>
  );
};

const SubPage1: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const activeChar = selected ? getCharacter(selected) : null;
  const activeQuotes = selected ? getQuotesByCharacter(selected) : QUOTES;
  const sideStyle = activeChar ? SIDE_STYLES[activeChar.side] : null;

  return (
    <div className="w-full min-h-full px-6 py-10  max-w-4xl mr-auto space-y-10">
      {/* ── Page header ── */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Overview
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Browse by Character
        </h1>
        <p className="text-gray-400 text-base">
          Select a character to filter their quotes.{" "}
          {selected ? (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-amber-400 hover:underline underline-offset-2"
            >
              Show all
            </button>
          ) : (
            <span className="text-gray-600">
              Showing all {QUOTES.length} quotes.
            </span>
          )}
        </p>
      </div>

      {/* ── Character filter pills ── */}
      <section aria-label="Character filter">
        <div className="flex flex-wrap gap-2">
          {CHARACTERS.map((char) => {
            const isActive = selected === char.id;
            const styles = SIDE_STYLES[char.side];
            const count = getQuotesByCharacter(char.id).length;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelected(isActive ? null : char.id)}
                aria-pressed={isActive}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  isActive
                    ? `${styles.badge} ${styles.border}`
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200",
                ].join(" ")}
              >
                {char.name}
                <span
                  className={[
                    "text-xs px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-white/20" : "bg-white/8 text-gray-500",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Active character callout ── */}
      {activeChar && sideStyle && (
        <div
          className={`rounded-xl border ${sideStyle.border} px-5 py-4 flex items-center justify-between gap-4`}
        >
          <div className="space-y-0.5">
            <p className={`text-lg font-semibold ${sideStyle.accent}`}>
              {activeChar.name}
            </p>
            <p className="text-sm text-gray-500">{activeChar.era}</p>
          </div>
          <SideBadge side={activeChar.side} />
        </div>
      )}

      {/* ── Quote list ── */}
      <section
        aria-label={activeChar ? `${activeChar.name}'s quotes` : "All quotes"}
        className="space-y-3"
      >
        {activeQuotes.map((quote) => {
          const char = getCharacter(quote.characterId);
          const styles = char ? SIDE_STYLES[char.side] : SIDE_STYLES.neutral;
          return (
            <article
              key={quote.id}
              className={`rounded-xl border ${styles.border} bg-white/2 p-5 space-y-3`}
            >
              <div className="flex items-start gap-3">
                <Quote
                  size={16}
                  className={`${styles.accent} opacity-50 shrink-0 mt-1`}
                  aria-hidden="true"
                />
                <blockquote className="text-base text-gray-200 leading-relaxed">
                  "{quote.text}"
                </blockquote>
              </div>
              <footer className="flex items-center gap-3 flex-wrap pl-7">
                {!selected && char && (
                  <>
                    <span className={`text-sm font-medium ${styles.accent}`}>
                      {char.name}
                    </span>
                    <span className="text-gray-700 text-xs">·</span>
                  </>
                )}
                <span className="text-sm text-gray-500 italic">
                  {quote.source}
                </span>
              </footer>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default SubPage1;
