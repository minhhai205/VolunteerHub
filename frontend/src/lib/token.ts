const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens(access: string, refresh: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem(ACCESS_TOKEN_KEY)
    : null;
}

export function getRefreshToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem(REFRESH_TOKEN_KEY)
    : null;
}

export function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
