import clsx from "clsx";
import { twMerge, type ClassNameValue } from "tailwind-merge";

export function cn(...classLists: ClassNameValue[]) {
  return twMerge(clsx(...classLists));
}
