import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type { User } from "@/lib/mockData";

interface PaginationState {
  pageNo: number;
  pageSize: number;
  totalPage: number;
}

interface UserListResponse {
  status: number;
  message: string;
  data: {
    pageNo: number; // backend 0-based
    pageSize: number;
    totalPage: number;
    data: User[];
  };
}

export function useUserList(
  page = 1,
  pageSize = 10,
  role?: string,
  search = ""
) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageNo: page, // UI uses 1-based page
    pageSize,
    totalPage: 1,
  });

  // refetch whenever page / pageSize / role / search changes
  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Convert UI 1-based page to backend 0-based page index
        const apiPage = Math.max(0, page - 1);

        const params = new URLSearchParams();
        params.set("page", String(apiPage)); // backend expects 0-based
        params.set("size", String(pageSize));
        if (role) params.set("role", role);
        if (search.trim()) params.set("search", search.trim());

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/user-list?${params.toString()}`;

        const res = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const body = (await res.json()) as UserListResponse;

        if (mounted) {
          setUsers(body.data?.data ?? []);
          // convert backend 0-based pageNo to UI 1-based pageNo
          const backendPageNo = body.data?.pageNo ?? apiPage;
          setPagination({
            pageNo: backendPageNo + 1,
            pageSize: body.data?.pageSize ?? pageSize,
            totalPage: body.data?.totalPage ?? 1,
          });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, role, search]);

  const refresh = () => {
    // callers can change page/role/search to trigger refetch
    setTimeout(() => {}, 0);
  };

  return { users, loading, error, pagination, refresh };
}
