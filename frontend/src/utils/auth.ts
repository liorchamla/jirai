import type { JwtPayload } from "../types/user";
import { jwtDecode } from "jwt-decode";

export function getToken(): string | null {
  return window.localStorage.getItem("token");
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // Token is expired
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function getUserInfo(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
