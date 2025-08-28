import type { Epic } from "./Epic";
import type { Team } from "./Team";
import type { User } from "./User";

export interface Project {
  slug: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  creator: User;
  status: "active" | "archived";
  teams: Team[];
  epics: Epic[];
}

export interface DetailProject {
  project: Project;
}
