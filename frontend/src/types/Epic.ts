import type { Ticket } from "./Ticket";
import type { Status } from "./Status";

export interface Epic {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "frozen";
  status: Status;
  tickets: Ticket[];
}
