import type { JwtPayload } from "../types/user";
import { jwtDecode } from "jwt-decode";
import { getApi, setToken } from "./api";

export async function authenticate(userData: {
  email: string;
  password: string;
}) {
  const response = await getApi()
    .url("/login")
    .post(userData)
    .json<{ token: string }>();
  window.localStorage.setItem("token", response.token);
  // J'ajoute le token aux headers de l'API pour les requêtes suivantes
  setToken(response.token);
}

export function initializeTokenForApi() {
  const token = window.localStorage.getItem("token");
  if (token) {
    setToken(token);
  }
}

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
