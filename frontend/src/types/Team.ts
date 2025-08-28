import type { User } from "./User";

export interface Team {
  slug: string;
  name: string;
  creator?: User;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
}
