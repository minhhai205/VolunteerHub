import Link from "next/link";
import Image from "next/image";

const roles = [
  {
    name: "Volunteer",
    description:
      "Tình nguyện viên có thể tìm kiếm, đăng ký tham gia các sự kiện tình nguyện, theo dõi lịch sử hoạt động và quản lý hồ sơ cá nhân.",
    path: "/home",
    email: "haiboss2005@gmail.com",
    password: "123456",
    color: "from-emerald-500 to-teal-600",
    bgCard: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    icon: "🙋‍♂️",
  },
  {
    name: "Manager",
    description:
      "Quản lý sự kiện có thể tạo, chỉnh sửa sự kiện, duyệt đơn đăng ký của tình nguyện viên, theo dõi tiến độ và xuất báo cáo.",
    path: "/manager/dashboard",
    email: "manager@example.com",
    password: "123456",
    color: "from-blue-500 to-indigo-600",
    bgCard: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    icon: "👨‍💼",
  },
  {
    name: "Admin",
    description:
      "Quản trị viên có toàn quyền quản lý hệ thống: quản lý người dùng, phân quyền, duyệt sự kiện, xem thống kê tổng quan.",
    path: "/admin/dashboard",
    email: "admin@example.com",
    password: "123456",
    color: "from-purple-500 to-pink-600",
    bgCard: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    icon: "🛡️",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-8">
            Demo Showcase
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            VolunteerHub
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Nền tảng kết nối tình nguyện viên với các tổ chức và sự kiện cộng
            đồng. Quản lý hoạt động tình nguyện một cách hiệu quả và minh bạch.
          </p>
        </div>
        {/* Tech Stack */}
        <section className="max-w-6xl mx-auto px-6 pb-8">
          <div className="flex flex-wrap justify-center gap-3 text-xs font-medium">
            {[
              "Next.js",
              "TypeScript",
              "Tailwind CSS",
              "Spring Boot",
              "MySQL",
              "Redis",
              "Docker",
              "Web Push API",
              "Vercel",
              "Railway",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </section>

      {/* Role Cards */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
          Chọn vai trò để trải nghiệm
        </h2>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-10">
          Chọn một vai trò bên dưới để trải nghiệm hệ thống. Tài khoản đã được
          điền sẵn — bạn chỉ cần nhấn <strong>Đăng nhập</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.name}
              className="relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">
                {role.name} Dashboard
              </h3>

              {/* Desc */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1 text-justify">
                {role.description}
              </p>

              {/* Credentials */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-4 mb-6 space-y-2 border border-slate-200 dark:border-slate-600">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Thông tin đăng nhập
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Email:
                  </span>
                  <code className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                    {role.email}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Password:
                  </span>
                  <code className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                    {role.password}
                  </code>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/auth/login?email=${encodeURIComponent(role.email)}&password=${encodeURIComponent(role.password)}`}
                className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                Đăng nhập →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-10">
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "🔐",
              title: "Đa vai trò, đa trải nghiệm",
              desc: "Mỗi người dùng có giao diện và chức năng riêng phù hợp với vai trò: Volunteer, Manager hoặc Admin.",
            },
            {
              icon: "📅",
              title: "Tìm & tham gia sự kiện",
              desc: "Duyệt danh sách sự kiện, đăng ký tham gia chỉ với một cú click và theo dõi trạng thái đăng ký.",
            },
            {
              icon: "🔔",
              title: "Nhận thông báo tức thì",
              desc: "Được thông báo ngay khi có sự kiện mới, đơn đăng ký được duyệt hoặc có cập nhật quan trọng.",
            },
            {
              icon: "💬",
              title: "Kết nối & tương tác",
              desc: "Đăng bài, bình luận và bày tỏ cảm xúc trong kênh sự kiện để gắn kết cộng đồng.",
            },
            {
              icon: "📊",
              title: "Báo cáo & thống kê",
              desc: "Xem tổng quan hoạt động qua dashboard trực quan, xuất báo cáo CSV/JSON dễ dàng.",
            },
            {
              icon: "⚡",
              title: "Nhanh & mượt mà",
              desc: "Trải nghiệm mượt với tốc độ tải nhanh.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          VolunteerHub &copy; 2025 &mdash; Frontend: Vercel | Backend &amp; DB:
          Railway
        </p>
      </footer>
    </div>
  );
}
