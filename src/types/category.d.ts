import type { ECategoryType } from "@/enums/category";

export interface ICategory {
  id: number;
  name: string;
  type: ECategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
