import type { JwtPayload } from "../types/user";

export function getToken(): string | null {
  return window.localStorage.getItem("token");
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getUserInfo(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
