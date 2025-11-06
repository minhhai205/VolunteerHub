"use client";

import { useState } from "react";
import EditProfileHeader from "./edit-profile-header";
import EditProfileSuccess from "./edit-profile-success";
import EditProfileForm from "./edit-profile-form";
import { useRouter } from "next/navigation";
import styles from "./edit-profile-form.module.css";

export default function EditProfilePage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const router = useRouter();

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="Quay lại"
          title="Quay lại"
        >
          ←
        </button>
        <EditProfileHeader />
        <EditProfileSuccess show={isSaved} />

        {/* Form Card */}
        <div className="bg-card border-2 border-accent/20 rounded-2xl shadow-sm p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-md">
          <EditProfileForm onSave={handleSave} />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Cảm ơn bạn đã tham gia cộng đồng tình nguyện viên của chúng tôi
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Thông tin của bạn được bảo mật và chỉ được sử dụng để liên lạc
          </p>
        </div>
      </div>
    </main>
  );
}
