import type { Team } from "../types/Team";
import { getApi } from "../utils/api";

export async function fetchTeams(): Promise<Team[]> {
  const response = (await getApi().get("/teams").json()) as { teams: Team[] };
  return response.teams;
}
