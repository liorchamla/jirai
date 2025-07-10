export interface User {
  uuid: string;
  username: string;
  email: string;
  position: string;
  teams: { name: string }[];
}

export interface JwtPayload {
  uuid: string;
  username: string;
  email: string;
}
