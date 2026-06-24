// import { ArrowLeft } from "lucide-react";
// import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";

// const SubPage1 = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full h-full p-6 flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl md:text-3xl font-heading text-stone-900 dark:text-white">
//           Sub Page 1
//         </h1>
//         <Button
//           onClick={() => navigate(-1)}
//           icon={<ArrowLeft size={16} />}
//           label="Go Back"
//           className="p-button-outlined p-button-sm"
//         />
//       </div>

//       {/* Description */}
//       <p className="text-stone-600 dark:text-stone-300 text-base md:text-lg max-w-2xl">
//         I burn my decency for someone else's future. I burn my life to make a
//         sunrise that I know I'll never see. And the ego that started this fight
//         will never have a mirror or an audience or the light of gratitude. So
//         what do I sacrifice? Everything!" - Luthen Rael
//       </p>
//     </div>
//   );
// };

// export default SubPage1;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import {
  questions,
  CATEGORIES,
  // DIFFICULTY_SEVERITY,
  type Category,
  type Difficulty,
  type Question,
} from "../utils/Data";

const ALL = "All";

const DIFFICULTY_OPTIONS = [
  { label: "All difficulties", value: ALL },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const CATEGORY_OPTIONS = [
  { label: "All eras", value: ALL },
  ...CATEGORIES.map((c) => ({ label: c, value: c })),
];

const DIFFICULTY_COLORS: Record<Difficulty, { dot: string; badge: string }> = {
  easy: {
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 border border-green-200",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  hard: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border border-red-200",
  },
};

const QuestionCard = ({ q }: { q: Question }) => {
  const [open, setOpen] = useState(false);
  const diff = DIFFICULTY_COLORS[q.difficulty];

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-shadow duration-150 hover:shadow-sm">
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-4 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Difficulty dot */}
        <span
          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${diff.dot}`}
          title={q.difficulty}
        />

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium text-stone-800 leading-snug">
            {q.question}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-400">{q.category}</span>
            <span className="text-stone-300 text-xs">·</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.badge}`}
            >
              {q.difficulty}
            </span>
          </div>
        </div>

        <i
          className={`pi pi-chevron-down text-stone-400 text-xs mt-1.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <Divider className="!my-0" />
          <div className="px-5 py-4 bg-stone-50">
            <p className="text-sm text-stone-700 leading-relaxed">{q.answer}</p>
          </div>
        </>
      )}
    </div>
  );
};

const SubPage1 = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | typeof ALL
  >(ALL);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | typeof ALL
  >(ALL);
  // const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const catMatch =
        selectedCategory === ALL || q.category === selectedCategory;
      const diffMatch =
        selectedDifficulty === ALL || q.difficulty === selectedDifficulty;
      return catMatch && diffMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  const hasFilters = selectedCategory !== ALL || selectedDifficulty !== ALL;

  return (
    <div className="w-full min-h-full p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            Browse & Study
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
            All Questions
          </h1>
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

      {/* ── Filters ── */}
      <div className="flex gap-3 flex-wrap items-center">
        <Dropdown
          value={selectedCategory}
          options={CATEGORY_OPTIONS}
          onChange={(e) => setSelectedCategory(e.value)}
          className="w-52"
          placeholder="All eras"
        />
        <Dropdown
          value={selectedDifficulty}
          options={DIFFICULTY_OPTIONS}
          onChange={(e) => setSelectedDifficulty(e.value)}
          className="w-44"
          placeholder="All difficulties"
        />
        {hasFilters && (
          <Button
            label="Clear"
            icon="pi pi-times"
            severity="secondary"
            text
            size="small"
            onClick={() => {
              setSelectedCategory(ALL);
              setSelectedDifficulty(ALL);
            }}
          />
        )}
        <span className="text-sm text-stone-400 ml-auto">
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Question List ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <i className="pi pi-inbox text-4xl text-stone-300" />
          <p className="text-stone-400 text-sm">
            No questions match these filters.
          </p>
          <Button
            label="Clear filters"
            severity="secondary"
            text
            size="small"
            onClick={() => {
              setSelectedCategory(ALL);
              setSelectedDifficulty(ALL);
            }}
          />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QuestionCard key={q.id} q={q} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubPage1;
