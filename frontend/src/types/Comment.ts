import type { User } from "./User";

export interface Comment {
  id: number;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  ticketId: number;
  creator: User;
}
