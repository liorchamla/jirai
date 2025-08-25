import type { Comment } from "./Comment";
import type { Status } from "./Status";
import type { User } from "./User";
import type { Epic } from "./Epic";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "frozen";
  epicId: number;
  epic: Epic;
  createdBy: string;
  creator: User;
  assignedTo: string | null; // UUID of user assigned to the ticket
  assignee?: User | null;
  status: Status;
  comments: Comment[];
  updatedAt?: string;
}
