// frontend/src/app/(public)/auth/hooks/useLogout.ts
import { useState } from "react";
import { getAccessToken, getRefreshToken, clearTokens } from "@/lib/token";

/**
 * Custom hook to handle user logout.
 *
 * @returns An object containing:
 * - `logout`: A function to initiate the logout process.
 * - `isLoading`: A boolean indicating if the logout API call is in progress.
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    try {
      // 1. Call the backend API to invalidate the tokens on the server
      // This endpoint expects an accessToken and refreshToken in the body
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (!response.ok) {
        // Even if the server call fails, we should log the user out on the client
        console.warn(
          "Server logout failed, proceeding with client-side logout."
        );
      }
    } catch (error) {
      console.error(
        "Logout API call failed, logging out client-side anyway:",
        error
      );
    } finally {
      // 2. Always clear tokens from local storage
      clearTokens();
      setIsLoading(false);

      // 3. Redirect to the login page
      // Use replace to prevent the user from navigating back to the protected page
      window.location.replace("/auth/login");
    }
  };

  return { logout, isLoading };
}
