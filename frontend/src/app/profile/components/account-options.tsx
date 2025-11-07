"use client";

import { useRouter } from "next/navigation"; // 1. Import useRouter
import { Card } from "@/components/ui/card";

export function AccountOptions() {
  const router = useRouter(); // 2. Khởi tạo router

  // 3. Tạo hàm xử lý
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Card className="p-6 border-primary/10">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Tùy chọn khác
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => handleNavigate("/activity")}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary/50 text-foreground transition-colors flex items-center justify-between group"
        >
          <span>Xem hoạt động của tôi</span>
          <span className="text-primary group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
        <button
          onClick={() => handleNavigate("/event/list")}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary/50 text-foreground transition-colors flex items-center justify-between group"
        >
          <span>Các dự án yêu thích</span>
          <span className="text-primary group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </Card>
  );
}
