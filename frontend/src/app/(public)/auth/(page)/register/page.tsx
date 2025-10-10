import { RegisterForm } from "./RegisterForm";
import { AuthLayout } from "../../AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Tham gia cộng đồng"
      subtitle="Bắt đầu tạo nên sự khác biệt ngay hôm nay"
      imageSrc="/images/login.jpg"
      imageAlt="Community volunteers"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
