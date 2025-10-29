export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Lấy thông tin từ biến môi trường
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error(
      "Cloudinary CLOUD_NAME hoặc UPLOAD_PRESET chưa được cấu hình."
    );
    throw new Error(
      "Lỗi cấu hình: Không thể tải ảnh lên. Vui lòng liên hệ quản trị viên."
    );
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || "Tải ảnh lên Cloudinary thất bại."
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi không xác định khi tải ảnh."
    );
  }
};
