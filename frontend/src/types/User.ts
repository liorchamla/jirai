import type { Team } from "./Team";

export interface User {
  uuid: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
  email: string;
  position: string;
  teams?: Team[];
}

export interface JwtPayload {
  uuid: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}
