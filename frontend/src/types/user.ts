import type { Team } from "./team";

export interface User {
  uuid: string;
  username: string;
  email: string;
  position: string;
  teams: Team[];
}

export interface JwtPayload {
  uuid: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}
