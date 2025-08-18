import type { Ticket } from "./Ticket";
import type { Status } from "./Status";
import type { Comment } from "./Comment";

export interface Epic {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "frozen";
  projectSlug: string;
  status: Status;
  tickets: Ticket[];
  comments: Comment[];
}
