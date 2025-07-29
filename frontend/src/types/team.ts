import type { User } from "./user";

export interface Team {
  slug: string;
  name: string;
  creator: User;
}
