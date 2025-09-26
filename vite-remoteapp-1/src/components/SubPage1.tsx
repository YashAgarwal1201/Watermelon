import { ArrowLeft } from "lucide-react";
import { Button } from "primereact/button";
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
        <Button
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={16} />}
          label="Go Back"
          className="p-button-outlined p-button-sm"
        />
      </div>

      {/* Description */}
      <p className="text-stone-600 dark:text-stone-300 text-base md:text-lg max-w-2xl">
        I burn my decency for someone else's future. I burn my life to make a
        sunrise that I know I'll never see. And the ego that started this fight
        will never have a mirror or an audience or the light of gratitude. So
        what do I sacrifice? Everything!" - Luthen Rael
      </p>
    </div>
  );
};

export default SubPage1;
