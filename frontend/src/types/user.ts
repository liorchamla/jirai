export interface User {
  username: string;
  email: string;
  position: string;
  teams: { name: string }[];
}
