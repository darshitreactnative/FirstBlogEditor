// src/models/BlogPost.ts
export type BlogPost = {
  id: string;
  title: string;
  content: string;

  authorId: string;
  collaborators: Record<string, true>;
 
  updatedAt: number;
  version: number;
  lastEditedBy: string;

  deleted?: boolean;

  syncStatus?: "synced" | "pending" | "error";
};