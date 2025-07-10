import wretch from "wretch";

export const api = wretch("http://localhost:3000/api/v1", {
  mode: "cors",
}).errorType("json");
