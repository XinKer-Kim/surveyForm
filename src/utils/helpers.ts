import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VariantProps } from "class-variance-authority"; // type-only import

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 필요하다면 VariantProps 타입도 함께 export 할 수 있습니다.
export type { VariantProps };
