import type { Database } from "@/types/database";
import type { RugPhotoCategory } from "@/types/domain";

export type RugPhoto = Database["public"]["Tables"]["rug_photos"]["Row"];

export type RugPhotoItem = RugPhoto & {
  publicUrl: string;
};

export type RugPhotoUploadState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: {
    photo?: string[];
    category?: string[];
    caption?: string[];
  };
};

export type RugVisualChecklistValues = {
  photographedOnEntry: boolean;
  conditionReviewed: boolean;
  cleaningCompleted: boolean;
  storedCorrectly: boolean;
  readyForExit: boolean;
};

export type RugVisualChecklistState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const rugPhotoCategoryLabels: Record<RugPhotoCategory, string> = {
  entry: "Entrada",
  before_cleaning: "Antes da limpeza",
  after_cleaning: "Depois da limpeza",
  stored: "Armazenada",
  exit: "Saida",
};
