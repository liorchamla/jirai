import type { Epic } from "./epic";
import type { Team } from "./team";
import type { User } from "./user";

export interface Project {
  slug: string;
  name: string;
  description: string;
  creator: User;
  status: "active" | "archived";
  teams: Team[];
  epics: Epic[];
}
