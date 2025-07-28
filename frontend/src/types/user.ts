export interface User {
  uuid: string;
  username: string;
  email: string;
  position: string;
  teams: TeamMember[];
}

export interface TeamMember {
  id: number;
  userId: string;
  teamId: string;
  team: {
    slug: string;
    name: string;
  };
}

export interface JwtPayload {
  uuid: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}
