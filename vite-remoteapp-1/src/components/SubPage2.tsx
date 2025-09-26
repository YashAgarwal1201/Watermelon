import { ArrowLeft } from "lucide-react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const SubPage2 = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-heading text-stone-900 dark:text-white">
          Sub Page 2
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
        The Empire is a disease that thrives in darkness, it is never more alive
        than when we asleep. It's easy for the dead to tell you to fight, and
        maybe it's true, maybe fighting is useless. Perhaps it's too late. But
        I'll tell you this, if I could do it again, I'd wake up early and be
        fighting those bastards from the start! Fight the Empire!" - Maarva
        Andor
      </p>
    </div>
  );
};

export default SubPage2;
