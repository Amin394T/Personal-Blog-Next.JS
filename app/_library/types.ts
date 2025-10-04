export type Comment = {
  id: number;
  user: string;
  date: string;
  content: string;
  parent: string | number;
  status: "normal" | "edited" | "removed" | "orphan" | "blocked";
  replies?: Comment[];
};