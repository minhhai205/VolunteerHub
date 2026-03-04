import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type LockAction = "lock" | "unlock";

interface UserLockResponse {}

/**
 * useLockUser
 * - Quản lý state loading/error cho hành động khóa/mở khóa.
 * - Gọi API để cập nhật trạng thái của user.
 * - Trả về một promise<boolean> cho biết API thành công hay thất bại.
 */
export function useLockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLockToggle = async (
    userId: string,
    action: LockAction
  ): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    setError(null);

    const lock = action === "lock";

    try {
      const token = localStorage.getItem("access_token") ?? "";
      const payload = { lock };

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/lock-user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let msg = `Request failed: ${res.status}`;
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch {
          // Bỏ qua lỗi parse JSON nếu response không có body
        }
        throw new Error(msg);
      }

      // API thành công
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setError(msg);

      // API thất bại
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLockToggle, loading, error };
}
