import wretch from "wretch";

let api = wretch(import.meta.env.VITE_API_URL + "/api/v1", {
  mode: "cors",
}).errorType("json");

export const getApi = () => {
  return api;
};

export const setToken = (token: string) => {
  api = api.headers({ Authorization: `Bearer ${token}` });
};
