// /lib/fetchWithAuth.ts
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "@/lib/token";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const accessToken = getAccessToken();

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
    result = await response.clone().json(); // clone để không mất body
  } catch {
    return response;
  }

  // Nếu backend trả status trong JSON khác 200 => token hết hạn
  if (result?.status !== 200) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
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
    } else {
      // Refresh thất bại → logout + chuyển về trang login
      handleInvalidRefreshToken();
    }
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

function handleInvalidRefreshToken() {
  clearTokens();

  // redirect về login
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}
