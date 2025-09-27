// File: composables/toastHandeler.ts

import { useToast } from "primevue/usetoast";
import type { ToastSeverity } from "../types/basic";

const toastHandler = () => {
  const toast = useToast();

  return {
    showToast: (
      severity: ToastSeverity,
      summary: string,
      detail: string,
      life: number = 2000
    ): void => {
      toast.add({ severity, summary, detail, life });
    },
  };
};

export default toastHandler;
