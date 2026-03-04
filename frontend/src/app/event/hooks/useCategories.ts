import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface Category {
  id: number;
  name: string;
}

export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");

        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/all`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải danh sách danh mục");
        }

        const result = (await response.json()) as CategoryResponse;

        setCategories(result.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Lỗi không xác định khi tải danh sách danh mục");
        }
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
