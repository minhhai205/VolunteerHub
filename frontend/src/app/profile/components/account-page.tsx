"use client";

import { ProfileCard } from "./profile-card";
import { StatisticsCard } from "./statistics-card";
import { AccountOptions } from "./account-options";

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

const mockUser: UserProfile = {
  name: "Nguyễn Văn A",
  email: "nguyen.van.a@example.com",
  role: "Tình nguyện viên tích cực",
  location: "Thành phố Hồ Chí Minh, Việt Nam",
  joinDate: "Tháng 3, 2023",
  bio: "Tôi là một tình nguyện viên yêu thích việc giúp đỡ cộng đồng và làm việc với các dự án xã hội.",
  volunteerHours: 240,
  projectsCompleted: 15,
  eventsAttended: 28,
  totalTimeParticipating: "6 tháng",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Thông Tin Tài Khoản
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và hoạt động tình nguyện của bạn
          </p>
        </div>

        <ProfileCard user={mockUser} />
        <StatisticsCard
          volunteerHours={mockUser.volunteerHours}
          projectsCompleted={mockUser.projectsCompleted}
          eventsAttended={mockUser.eventsAttended}
          totalTimeParticipating={mockUser.totalTimeParticipating}
        />
        <AccountOptions />
      </div>
    </main>
  );
}
