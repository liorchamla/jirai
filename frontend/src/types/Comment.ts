import type { User } from "./User";

export interface Comment {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  ticketId: number | null;
  epicId: number | null;
  creator?: User;
}
