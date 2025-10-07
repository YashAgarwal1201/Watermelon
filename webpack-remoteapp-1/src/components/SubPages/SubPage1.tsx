import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubPage1 = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-heading text-stone-900 dark:text-white">
          Sub Page 1
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
      {/* Description */}
      <p className="text-stone-600 dark:text-stone-300 text-base md:text-lg max-w-2xl">
        "Sometimes the things we want the most don’t happen the way we imagine."
        - Kanan Jarrus
      </p>
    </div>
  );
};

export default SubPage1;
