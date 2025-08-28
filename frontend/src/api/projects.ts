import type { DetailProject, Project } from "../types/Project";
import { getApi } from "../utils/api";

export function fetchProjectDetail(
  projectSlug: string
): Promise<DetailProject> {
  return getApi().get(`/projects/${projectSlug}`).json();
}

export function fetchProjects(): Promise<{ projects: Project[] }> {
  return getApi().get("/projects").json();
}

export function deleteProject(projectSlug: string): Promise<void> {
  return getApi().delete(`/projects/${projectSlug}`).res();
}
