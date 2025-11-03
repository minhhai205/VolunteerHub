// /lib/fetchWithAuth.ts
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "@/lib/token";
import { showUnauthorizedDialog } from "@/lib/unauthorizedDialog";

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let accessToken = checkAndGetAccessToken() ?? "";

  if (accessToken === "") {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      handleUnAuthorized();
      return new Response(null, { status: 401 });
    }

    accessToken = getAccessToken() ?? "";
  }

  const config: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "Content-Type": "application/json",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };

  // Gọi API ban đầu
  let response = await fetch(input, config);
  let result;
  try {
    result = await response.clone().json();
  } catch {
    return response;
  }

  // Nếu backend trả status trong JSON 401 => token hết hạn or unauthorized
  if (result?.status === 401) {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      handleUnAuthorized();
      return new Response(null, { status: 401 });
    }

    // Gọi lại request với accessToken mới
    const newAccessToken = getAccessToken();
    const retryConfig: RequestInit = {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    };

    response = await fetch(input, retryConfig);
  }

  return response;
}

// ------------------------

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch("http://localhost:8080/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const result = (await response.json()) as {
      status: number;
      message: string;
      data?: {
        accessToken: string;
        refreshToken: string;
      };
    };

    if (result.status === 200 && result.data?.accessToken) {
      saveTokens(result.data.accessToken, result.data.refreshToken);
      return true;
    }

    console.error("Refresh failed:", result.message);
    return false;
  } catch (e) {
    console.error("Refresh token exception:", e);
    return false;
  }
}

function handleUnAuthorized() {
  clearTokens();

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname + window.location.search;
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
      currentPath
    )}`;
    
    showUnauthorizedDialog(redirectUrl);
  }
}

function checkAndGetAccessToken(): string {
  const token = getAccessToken();
  if (!token) return "";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return isExpired ? "" : token;
  } catch {
    return "";
  }
}
