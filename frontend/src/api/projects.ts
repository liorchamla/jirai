import type { DetailProject } from "../types/Project";
import { getApi } from "../utils/api";

export function fetchProjectDetail(
  projectSlug: string
): Promise<DetailProject> {
  return getApi().get(`/projects/${projectSlug}`).json();
}
