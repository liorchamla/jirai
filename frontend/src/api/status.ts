import type { Status } from "../types/Status";
import { getApi } from "../utils/api";

export function fetchEpicStatus(): Promise<Status[]> {
  return getApi().get("/status").json();
}
