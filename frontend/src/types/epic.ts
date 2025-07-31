export interface Epic {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "frozen";
}
