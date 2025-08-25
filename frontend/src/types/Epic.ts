import type { Ticket } from "./Ticket";
import type { Status } from "./Status";
import type { Comment } from "./Comment";
import type { User } from "./User";

export interface Epic {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  creator: User;
  assignedTo: string | null; // UUID of user assigned to the epic
  assignee?: User | null;
  priority: "high" | "medium" | "low" | "frozen";
  projectSlug: string;
  status: Status;
  tickets: Ticket[];
  comments: Comment[];
  updatedAt?: string;
}
