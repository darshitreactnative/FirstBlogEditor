// src/utils/conflictResolver.ts
import { BlogPost } from "../models/BlogPost";

export const resolveConflict = (
  local: BlogPost,
  remote: BlogPost
): BlogPost => {
  return local.updatedAt > remote.updatedAt ? local : remote;
};
