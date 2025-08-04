import type { JwtPayload } from "../types/User";
import { jwtDecode } from "jwt-decode";
import { getApi, setToken } from "./api";
import { createContext, useState } from "react";

export const AuthContext = createContext<{
  userInfo: JwtPayload | null;
  authenticate: (userData: {
    email: string;
    password: string;
  }) => Promise<void>;
}>({ userInfo: null, authenticate: async () => {} });

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(
    initializeTokenForApi()
  );
  async function authenticate(userData: { email: string; password: string }) {
    const response = await getApi()
      .url("/login")
      .post(userData)
      .json<{ token: string }>();
    window.localStorage.setItem("token", response.token);
    // J'ajoute le token aux headers de l'API pour les requêtes suivantes
    setToken(response.token);
    // Je décode le token pour obtenir les informations de l'utilisateur
    const decodedInfo = decodeToken(response.token);
    if (decodedInfo) {
      setUserInfo(decodedInfo);
    }
  }
  return {
    userInfo,
    authenticate,
  };
};

export function initializeTokenForApi() {
  const token = window.localStorage.getItem("token");
  if (token) {
    setToken(token);
    const decodedInfo = decodeToken(token);
    if (decodedInfo) {
      return decodedInfo;
    }
  }
  return null;
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
