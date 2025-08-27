import type { User } from "../types/User";
import { getApi } from "../utils/api";

export function fetchUsersByProject(projectSlug: string): Promise<User[]> {
  return getApi().get(`/projects/${projectSlug}/users`).json();
}
