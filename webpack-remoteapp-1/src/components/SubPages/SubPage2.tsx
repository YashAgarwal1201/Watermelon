import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shuffle,
  Bookmark,
  BookmarkCheck,
  Quote,
  Trash2,
} from "lucide-react";
import {
  randomQuote,
  getCharacter,
  SIDE_STYLES,
  type Quote as TQuote,
} from "./../../data/quotes";

const SubPage2: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<TQuote>(() => randomQuote());
  const [favourites, setFavourites] = useState<TQuote[]>([]);

  const isFavourited = favourites.some((q) => q.id === current.id);

  const draw = useCallback(() => {
    setCurrent((prev) => {
      // keep drawing until we get a different quote
      let next = randomQuote();
      while (next.id === prev.id) next = randomQuote();
      return next;
    });
  }, []);

  const toggleFavourite = useCallback(() => {
    setFavourites((prev) =>
      prev.some((q) => q.id === current.id)
        ? prev.filter((q) => q.id !== current.id)
        : [current, ...prev],
    );
  }, [current]);

  const removeFavourite = useCallback((id: string) => {
    setFavourites((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const character = getCharacter(current.characterId);
  const sideStyle = character
    ? SIDE_STYLES[character.side]
    : SIDE_STYLES.neutral;

  return (
    <div className="w-full min-h-full px-6 py-10  max-w-4xl mr-auto space-y-12">
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
          Random Quote
        </h1>
        <p className="text-gray-400 text-base">
          Draw from the archive and bookmark your favourites.
        </p>
      </div>

      {/* ── Random quote card ── */}
      <section aria-label="Current random quote" className="space-y-4">
        <div
          className={`rounded-xl border ${sideStyle.border} p-7 space-y-5 transition-colors duration-300`}
        >
          <Quote
            size={22}
            className={`${sideStyle.accent} opacity-50`}
            aria-hidden="true"
          />
          <blockquote>
            <p className="text-2xl md:text-3xl font-medium text-white leading-snug">
              "{current.text}"
            </p>
          </blockquote>
          <footer className="flex items-center gap-3 flex-wrap">
            {character && (
              <span className={`text-base font-semibold ${sideStyle.accent}`}>
                {character.name}
              </span>
            )}
            <span className="text-gray-600 hidden sm:inline">·</span>
            <span className="text-sm text-gray-500 italic">
              {current.source}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={draw}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-semibold text-sm transition-colors"
          >
            <Shuffle size={15} aria-hidden="true" />
            Draw another
          </button>
          <button
            type="button"
            onClick={toggleFavourite}
            aria-label={
              isFavourited ? "Remove from favourites" : "Save to favourites"
            }
            className={[
              "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
              isFavourited
                ? "bg-amber-400/10 border-amber-500/40 text-amber-300 hover:bg-amber-400/15"
                : "border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200",
            ].join(" ")}
          >
            {isFavourited ? (
              <BookmarkCheck size={15} aria-hidden="true" />
            ) : (
              <Bookmark size={15} aria-hidden="true" />
            )}
            {isFavourited ? "Saved" : "Save"}
          </button>
        </div>
      </section>

      {/* ── Favourites ── */}
      {favourites.length > 0 && (
        <section aria-label="Saved quotes" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-amber-500/60" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
              Saved · {favourites.length}
            </span>
          </div>

          <div className="space-y-3">
            {favourites.map((quote) => {
              const char = getCharacter(quote.characterId);
              const styles = char
                ? SIDE_STYLES[char.side]
                : SIDE_STYLES.neutral;
              return (
                <article
                  key={quote.id}
                  className={`rounded-xl border ${styles.border} bg-white/2 p-4 space-y-2`}
                >
                  <div className="flex items-start gap-3">
                    <Quote
                      size={14}
                      className={`${styles.accent} opacity-40 shrink-0 mt-1`}
                      aria-hidden="true"
                    />
                    <p className="text-sm text-gray-200 leading-relaxed flex-1">
                      "{quote.text}"
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFavourite(quote.id)}
                      aria-label={`Remove "${quote.text.slice(0, 30)}…" from saved`}
                      className="shrink-0 text-gray-600 hover:text-red-400 transition-colors mt-0.5"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <footer className="flex items-center gap-2 pl-[22px] flex-wrap">
                    {char && (
                      <span className={`text-xs font-medium ${styles.accent}`}>
                        {char.name}
                      </span>
                    )}
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-xs text-gray-500 italic">
                      {quote.source}
                    </span>
                  </footer>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default SubPage2;
