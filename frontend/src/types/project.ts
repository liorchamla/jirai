export interface Project {
  slug: string;
  name: string;
  description: string;
  createdBy: string;
  status: "active" | "archived";
}
