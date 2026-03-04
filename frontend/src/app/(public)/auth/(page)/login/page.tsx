import { Suspense } from "react"
import { LoginForm } from "./LoginForm"
import { AuthLayout } from "../../AuthLayout"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục hành trình tình nguyện của bạn"
      imageSrc="/images/login.jpg"
      imageAlt="Volunteers working together"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
