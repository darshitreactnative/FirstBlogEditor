// src/models/BlogPost.ts
export type BlogPost = {
  id: string;
  title: string;
  content: string;

  authorId: string;
  authorName: string;

  collaborators: Record<string, true>;

  collaboratorNames: Record<string, string>;

  updatedAt: number;
  version: number;

  lastEditedBy: string;
  lastEditedByName: string;

  deleted?: boolean;
  syncStatus?: "synced" | "pending" | "error";
};
