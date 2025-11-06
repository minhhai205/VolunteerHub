"use client";

import { Mail, MapPin, Calendar, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button as UIButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  joinDate: string;
  bio: string;
}

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  const handleEdit = () => {
    router.push("/profile/update");
  };
  return (
    <Card className="mb-8 overflow-hidden border-primary/10 bg-card shadow-lg">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10" />

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar and Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 mb-8">
          <div className="h-24 w-24 rounded-full border-4 border-card bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-1">
              {user.name}
            </h2>
            <p className="text-primary font-medium mb-2">{user.role}</p>
            <p className="text-muted-foreground text-sm">{user.bio}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Email
              </p>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Số điện thoại
              </p>
              <p className="text-foreground font-medium">{user.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Ngày tham gia
              </p>
              <p className="text-foreground font-medium">{user.joinDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Trạng thái
              </p>
              <p className="text-foreground font-medium">Hoạt động</p>
            </div>
          </div>
        </div>

        <div className="flex">
          <UIButton
            onClick={handleEdit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Chỉnh sửa thông tin
          </UIButton>
        </div>
      </div>
    </Card>
  );
}
