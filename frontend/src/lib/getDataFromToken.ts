import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./token";

type JwtPayload = {
  sub: string;
  scope: string;
  exp: number;
};

/**
 * Lấy role từ JWT token
 */
export function getUserRole(): string | null {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) return null;

    const decoded = jwtDecode<JwtPayload>(accessToken);
    const role = decoded.scope?.replace("ROLE_", "");
    return role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}