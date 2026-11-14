// Shared types and design tokens used by the mobile and web apps.

export type Mode = "date" | "friends" | "network";

export interface Profile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio?: string;
  prompts: { question: string; answer: string }[];
  interests: string[];
  distanceKm?: number;
  verified: boolean;
  mode: Mode;
}

export { tokens } from "../tokens.js";
