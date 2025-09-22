import { ArrowLeft, Info } from "lucide-react";
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
        This is a sample subpage. You can use it as a template to display more
        detailed content, widgets, or feature-specific information.
      </p>

      {/* Content Section */}
      <div className="bg-rose-50 dark:bg-stone-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3">
          <Info size={18} /> Quick Highlights
        </h2>
        <ul className="list-disc pl-6 text-stone-700 dark:text-stone-200 space-y-2">
          <li>Reusable layout pattern</li>
          <li>Dark mode ready</li>
          <li>Responsive design with Tailwind</li>
        </ul>
      </div>

      {/* Action Section */}
      <div className="flex justify-end">
        <Button
          label="Learn More"
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full"
        />
      </div>
    </div>
  );
};

export default SubPage1;
