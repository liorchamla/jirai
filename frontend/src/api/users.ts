import { getApi } from "../utils/api";

export function fetchUsersByProject(
  projectSlug: string
): Promise<{ uuid: string; username: string }[]> {
  return getApi().get(`/projects/${projectSlug}/users`).json();
}
