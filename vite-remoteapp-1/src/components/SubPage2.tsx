import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  questionsByCategory,
  type Category,
  type Difficulty,
  type Question,
} from "../utils/Data";

const CATEGORY_STYLES: Record<
  Category,
  {
    bg: string;
    activeBg: string;
    text: string;
    border: string;
    accent: string;
    diffBadge: Record<Difficulty, string>;
  }
> = {
  "Ancient Civilizations": {
    bg: "bg-amber-50",
    activeBg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-200",
    accent: "border-l-amber-400",
    diffBadge: {
      easy: "bg-amber-100 text-amber-800",
      medium: "bg-amber-200 text-amber-900",
      hard: "bg-amber-300 text-amber-950",
    },
  },
  "Medieval World": {
    bg: "bg-stone-50",
    activeBg: "bg-stone-100",
    text: "text-stone-900",
    border: "border-stone-200",
    accent: "border-l-stone-400",
    diffBadge: {
      easy: "bg-stone-100 text-stone-700",
      medium: "bg-stone-200 text-stone-800",
      hard: "bg-stone-300 text-stone-900",
    },
  },
  "Age of Exploration": {
    bg: "bg-teal-50",
    activeBg: "bg-teal-100",
    text: "text-teal-900",
    border: "border-teal-200",
    accent: "border-l-teal-400",
    diffBadge: {
      easy: "bg-teal-100 text-teal-800",
      medium: "bg-teal-200 text-teal-900",
      hard: "bg-teal-300 text-teal-950",
    },
  },
  "Revolutions & Independence": {
    bg: "bg-red-50",
    activeBg: "bg-red-100",
    text: "text-red-900",
    border: "border-red-200",
    accent: "border-l-red-400",
    diffBadge: {
      easy: "bg-red-100 text-red-800",
      medium: "bg-red-200 text-red-900",
      hard: "bg-red-300 text-red-950",
    },
  },
  "World Wars": {
    bg: "bg-zinc-50",
    activeBg: "bg-zinc-100",
    text: "text-zinc-900",
    border: "border-zinc-300",
    accent: "border-l-zinc-500",
    diffBadge: {
      easy: "bg-zinc-100 text-zinc-700",
      medium: "bg-zinc-200 text-zinc-800",
      hard: "bg-zinc-300 text-zinc-900",
    },
  },
  "Cold War & Modern Era": {
    bg: "bg-blue-50",
    activeBg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-200",
    accent: "border-l-blue-400",
    diffBadge: {
      easy: "bg-blue-100 text-blue-800",
      medium: "bg-blue-200 text-blue-900",
      hard: "bg-blue-300 text-blue-950",
    },
  },
};

const QuestionRow = ({
  q,
  styles,
}: {
  q: Question;
  styles: (typeof CATEGORY_STYLES)[Category];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-l-4 ${styles.accent} rounded-r-xl ${styles.bg} border border-l-0 ${styles.border} overflow-hidden`}
    >
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${styles.text}`}>
            {q.question}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.diffBadge[q.difficulty]}`}
          >
            {q.difficulty}
          </span>
          <i
            className={`pi pi-chevron-down text-xs transition-transform duration-200 ${styles.text} opacity-50 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <>
          <Divider className="my-0!" />
          <div className={`px-4 py-3 ${styles.activeBg}`}>
            <p className={`text-sm leading-relaxed ${styles.text} opacity-90`}>
              {q.answer}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const SubPage2 = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCategory = searchParams.get("category") as Category | null;

  const [activeCategory, setActiveCategory] = useState<Category>(
    paramCategory && CATEGORIES.includes(paramCategory)
      ? paramCategory
      : CATEGORIES[0],
  );

  useEffect(() => {
    if (paramCategory && CATEGORIES.includes(paramCategory)) {
      setActiveCategory(paramCategory);
    }
  }, [paramCategory]);

  const categoryQuestions = useMemo(
    () => questionsByCategory[activeCategory],
    [activeCategory],
  );

  const styles = CATEGORY_STYLES[activeCategory];

  const easyCount = categoryQuestions.filter(
    (q) => q.difficulty === "easy",
  ).length;
  const mediumCount = categoryQuestions.filter(
    (q) => q.difficulty === "medium",
  ).length;
  const hardCount = categoryQuestions.filter(
    (q) => q.difficulty === "hard",
  ).length;

  const handleCategorySelect = (cat: Category) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat });
  };

  return (
    <div className="w-full min-h-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-56 lg:w-64 shrink-0 border-b md:border-b-0 md:border-r border-stone-200 bg-stone-50 p-4 space-y-1">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium px-2 pb-2">
          Eras
        </p>
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const s = CATEGORY_STYLES[cat];
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`
                w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-100 cursor-pointer
                ${
                  isActive
                    ? `${s.activeBg} ${s.text} font-medium`
                    : "text-stone-600 hover:bg-stone-100"
                }
              `}
            >
              <i
                className={`pi ${CATEGORY_ICONS[cat]} text-base shrink-0 ${isActive ? s.text : "text-stone-400"}`}
              />
              <span className="leading-snug">{cat}</span>
              {isActive && (
                <span
                  className={`ml-auto text-xs font-semibold ${s.text} opacity-60`}
                >
                  {questionsByCategory[cat].length}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* Main Panel */}
      <div className="flex-1 min-w-0 p-6 md:p-8 space-y-6">
        {/* Category header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <i
                className={`pi ${CATEGORY_ICONS[activeCategory]} text-xl ${styles.text}`}
              />
              <h1 className={`text-xl md:text-2xl font-bold ${styles.text}`}>
                {activeCategory}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400 pl-7">
              <span>{categoryQuestions.length} questions</span>
              <span>·</span>
              <span className="text-green-600">{easyCount} easy</span>
              <span>·</span>
              <span className="text-amber-600">{mediumCount} medium</span>
              <span>·</span>
              <span className="text-red-600">{hardCount} hard</span>
            </div>
          </div>
          <Button
            onClick={() => navigate(-1)}
            icon="pi pi-arrow-left"
            label="Back"
            severity="secondary"
            outlined
            size="small"
          />
        </div>

        <Divider className="my-0!" />

        {/* Questions */}
        <div className="space-y-2">
          {categoryQuestions.map((q) => (
            <QuestionRow key={q.id} q={q} styles={styles} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubPage2;
