"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "./profile-card";
import { StatisticsCard } from "./statistics-card";
import { AccountOptions } from "./account-options";
import styles from "./account.module.css";
import { getAccessToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface ApiUserRole {
  id: number;
  name: string;
  description: string;
}

interface ApiUserData {
  id: number;
  email: string;
  fullName: string;
  status: string;
  phoneNumber: string;
  role: ApiUserRole;
  createdAt: string;
}

interface ApiWorkingData {
  workingDay: number;
  workingHour: number;
  numberOfProject: number;
  completedProject: number;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  joinDate: string;
  bio: string;
  volunteerHours: number;
  projectsCompleted: number;
  eventsAttended: number;
  totalTimeParticipating: string;
}

const formatJoinDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const month = date.getMonth() + 1; // getMonth() bắt đầu từ 0
    const year = date.getFullYear();
    return `Tháng ${month}, ${year}`;
  } catch (e) {
    return "Không rõ";
  }
};

const calculateTotalTime = (isoString: string): string => {
  try {
    const startDate = new Date(isoString);
    const now = new Date();

    let months = (now.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += now.getMonth();

    if (months <= 0) return "Mới tham gia";
    if (months === 1) return "1 tháng";

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${months} tháng`;
    if (remainingMonths === 0) return `${years} năm`;

    return `${years} năm ${remainingMonths} tháng`;
  } catch (e) {
    return "Không rõ";
  }
};

const transformApiToProfile = (
  infoData: ApiUserData,
  workingData: ApiWorkingData
): UserProfile => {
  const location = infoData.phoneNumber;
  console.log(infoData);
  console.log(workingData);
  return {
    name: infoData.fullName,
    email: infoData.email,
    role: infoData.role.name,
    bio: infoData.role.description,
    joinDate: formatJoinDate(infoData.createdAt),
    totalTimeParticipating: calculateTotalTime(infoData.createdAt),

    location: location,
    volunteerHours: workingData.workingHour,
    projectsCompleted: workingData.completedProject,
    eventsAttended: workingData.numberOfProject,
  };
};
export default function AccountPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy token (việc này có thể chạy mỗi lần render)
  const token = getAccessToken();
  const sub = useMemo(() => {
    if (!token) {
      return null;
    }
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.sub; // Đây là giá trị chúng ta cần
    } catch (e) {
      console.error("Lỗi khi giải mã token:", e);
      return null; // Trả về null nếu token không hợp lệ
    }
  }, [token]); // Chỉ tính toán lại khi 'token' thay đổi
  useEffect(() => {
    const userEmail = sub;
    if (!userEmail) {
      setError("Không tìm thấy thông tin người dùng (sub).");
      setIsLoading(false);
      return; // Dừng lại
    }

    // Định nghĩa hàm async bên trong để fetch dữ liệu
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Xóa lỗi cũ khi fetch lại

        const [infoResponse, workingResponse] = await Promise.all([
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/information/${userEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          ),
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/working-information/${userEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          ),
        ]);

        // ... (phần còn lại của logic fetch của bạn là RẤT TỐT) ...
        if (!infoResponse.ok || !workingResponse.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ máy chủ.");
        }
        const infoResult = await infoResponse.json();
        const workingResult = await workingResponse.json();

        // ...

        const transformedProfile = transformApiToProfile(
          infoResult.data,
          workingResult.data
        );

        console.log(transformedProfile);
        setUserProfile(transformedProfile);
      } catch (err: unknown) {
        console.error("Fetch data error:", err);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Gọi hàm fetch
  }, [sub]); // <-- Thêm 'sub' vào mảng dependency

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Đang tải thông tin tài khoản...</p>
      </main>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error || !userProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Lỗi: {error || "Không thể tải thông tin tài khoản."}
        </p>
      </main>
    );
  }

  // Khi đã có dữ liệu, hiển thị trang
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="Quay lại"
          title="Quay lại"
        >
          ←
        </button>

        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Thông Tin Tài Khoản
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và hoạt động tình nguyện của bạn
          </p>
        </div>

        {/* Truyền dữ liệu 'userProfile' đã biến đổi vào các component con */}
        <ProfileCard user={userProfile} />
        <StatisticsCard
          volunteerHours={userProfile.volunteerHours}
          projectsCompleted={userProfile.projectsCompleted}
          eventsAttended={userProfile.eventsAttended}
          totalTimeParticipating={userProfile.totalTimeParticipating}
        />
        <AccountOptions />
      </div>
    </main>
  );
}
