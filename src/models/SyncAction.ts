// src/models/SyncAction.ts
export type SyncAction = {
  id: string;
  userId: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  payload: any;
  timestamp: number;
};
