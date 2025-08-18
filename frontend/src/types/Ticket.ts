import type { Comment } from "./Comment";
import type { Status } from "./Status";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "frozen";
  epicId: number;
  status: Status;
  comments: Comment[];
}
