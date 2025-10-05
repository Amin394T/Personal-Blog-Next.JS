export type Comment = {
  id: number;
  user: string;
  date: string;
  content: string;
  parent: string | number;
  status: "normal" | "edited" | "removed" | "orphan" | "blocked";
  replies?: Comment[];
};

export type Article = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  description: string;
  tags: string[];
  hidden?: boolean;
};