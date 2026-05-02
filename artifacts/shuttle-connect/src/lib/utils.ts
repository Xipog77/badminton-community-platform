import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SKILL_DISPLAY: Record<string, string> = {
  "new": "Mới",
  "weak": "Yếu",
  "average": "Trung bình",
  "good": "Khá",
  "very_good": "Tốt",
  "pro": "Chuyên nghiệp",
  "Elite": "Tinh anh",
};

export function displaySkill(skill: string): string {
  return SKILL_DISPLAY[skill] ?? skill;
}
