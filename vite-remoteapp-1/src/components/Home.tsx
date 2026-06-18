import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import {
  questions,
  questionsByCategory,
  CATEGORIES,
  CATEGORY_ICONS,
  TOTAL_QUESTIONS,
  type Category,
} from "../utils/Data";

const CATEGORY_COLORS: Record<
  Category,
  { bg: string; text: string; border: string; badge: string }
> = {
  "Ancient Civilizations": {
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
  "Medieval World": {
    bg: "bg-stone-50",
    text: "text-stone-900",
    border: "border-stone-200",
    badge: "bg-stone-100 text-stone-800",
  },
  "Age of Exploration": {
    bg: "bg-teal-50",
    text: "text-teal-900",
    border: "border-teal-200",
    badge: "bg-teal-100 text-teal-800",
  },
  "Revolutions & Independence": {
    bg: "bg-red-50",
    text: "text-red-900",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
  },
  "World Wars": {
    bg: "bg-zinc-50",
    text: "text-zinc-900",
    border: "border-zinc-300",
    badge: "bg-zinc-200 text-zinc-800",
  },
  "Cold War & Modern Era": {
    bg: "bg-blue-50",
    text: "text-blue-900",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
};

const DIFFICULTY_COUNTS = {
  easy: questions.filter((q) => q.difficulty === "easy").length,
  medium: questions.filter((q) => q.difficulty === "medium").length,
  hard: questions.filter((q) => q.difficulty === "hard").length,
};

const Home = () => {
  const navigate = useNavigate();
  const [answerVisible, setAnswerVisible] = useState(false);

  const questionOfTheDay = useMemo(() => {
    const seed = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return questions[Math.abs(hash) % questions.length];
  }, []);

  const qotdColors = CATEGORY_COLORS[questionOfTheDay.category];

  return (
    <div className="w-full min-h-full p-6 md:p-10 space-y-10">
      {/* ── Hero ── */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
          World History
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
          Question Bank
        </h1>
        <p className="text-stone-500 text-base max-w-xl pt-1">
          {TOTAL_QUESTIONS} questions across {CATEGORIES.length} eras — from the
          first rivers of civilization to the Cold War.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-md">
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-green-200 bg-green-50">
          <span className="text-2xl font-bold text-green-800">
            {DIFFICULTY_COUNTS.easy}
          </span>
          <span className="text-xs text-green-600 mt-1 font-medium">Easy</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-200 bg-amber-50">
          <span className="text-2xl font-bold text-amber-800">
            {DIFFICULTY_COUNTS.medium}
          </span>
          <span className="text-xs text-amber-600 mt-1 font-medium">
            Medium
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-red-200 bg-red-50">
          <span className="text-2xl font-bold text-red-800">
            {DIFFICULTY_COUNTS.hard}
          </span>
          <span className="text-xs text-red-600 mt-1 font-medium">Hard</span>
        </div>
      </div>

      <Divider className="my-0!" />

      {/* ── Question of the Day ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <i className="pi pi-star-fill text-amber-400 text-sm" />
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            Question of the day
          </span>
        </div>

        <div
          className={`rounded-2xl border ${qotdColors.border} ${qotdColors.bg} p-6 space-y-4 max-w-3xl`}
        >
          <div className="flex items-start justify-between gap-4">
            <p
              className={`text-lg font-semibold leading-snug ${qotdColors.text} flex-1`}
            >
              {questionOfTheDay.question}
            </p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${qotdColors.badge}`}
            >
              {questionOfTheDay.category}
            </span>
          </div>

          {answerVisible ? (
            <div className="space-y-3">
              <Divider className={`my-0! border-${qotdColors.border}`} />
              <p
                className={`text-base leading-relaxed ${qotdColors.text} opacity-90`}
              >
                {questionOfTheDay.answer}
              </p>
              <Button
                label="Hide answer"
                icon="pi pi-eye-slash"
                severity="secondary"
                text
                size="small"
                onClick={() => setAnswerVisible(false)}
                className="p-0! text-xs!"
              />
            </div>
          ) : (
            <Button
              label="Reveal answer"
              icon="pi pi-eye"
              severity="secondary"
              outlined
              size="small"
              onClick={() => setAnswerVisible(true)}
            />
          )}
        </div>
      </div>

      <Divider className="my-0!" />

      {/* ── Categories ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">
            Browse by era
          </h2>
          <Button
            label="Browse all"
            icon="pi pi-arrow-right"
            iconPos="right"
            severity="secondary"
            text
            size="small"
            onClick={() => navigate("/sub-page-1")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const colors = CATEGORY_COLORS[cat];
            const count = questionsByCategory[cat].length;
            const easyCount = questionsByCategory[cat].filter(
              (q) => q.difficulty === "easy",
            ).length;
            const hardCount = questionsByCategory[cat].filter(
              (q) => q.difficulty === "hard",
            ).length;

            return (
              <button
                key={cat}
                onClick={() =>
                  navigate(`/sub-page-2?category=${encodeURIComponent(cat)}`)
                }
                className={`
                  group text-left rounded-xl border ${colors.border} ${colors.bg}
                  p-5 space-y-3 transition-all duration-150
                  hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]
                  cursor-pointer
                `}
              >
                <div className="flex items-start justify-between">
                  <i
                    className={`pi ${CATEGORY_ICONS[cat]} text-2xl ${colors.text} opacity-70`}
                  />
                  <Badge
                    value={`${count} Q`}
                    className={`text-xs !${colors.badge}`}
                  />
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm leading-snug ${colors.text}`}
                  >
                    {cat}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {easyCount} easy · {hardCount} hard
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer nudge ── */}
      <div className="pt-2 pb-6 flex gap-3 flex-wrap">
        <Button
          label="Study mode — browse all questions"
          icon="pi pi-book"
          onClick={() => navigate("/sub-page-1")}
          severity="secondary"
          outlined
        />
        <Button
          label="Drill by category"
          icon="pi pi-filter"
          onClick={() => navigate("/sub-page-2")}
        />
      </div>
    </div>
  );
};

export default Home;
