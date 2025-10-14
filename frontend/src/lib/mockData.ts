// Mock data cho admin dashboard

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  participants: number;
  likes: number;
  comments: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "volunteer" | "event_manager" | "admin";
  status: "active" | "locked";
  joinedAt: string;
  eventsJoined: number;
  eventsCreated: number;
  avatar?: string;
}

export interface DashboardStats {
  totalEvents: number;
  pendingEvents: number;
  totalUsers: number;
  activeVolunteers: number;
  newEventsThisWeek: number;
  popularEvents: number;
}

// Mock events data
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Chiến dịch Trồng cây xanh 2024",
    description: "Trồng 1000 cây xanh tại khu vực ngoại thành",
    location: "Hà Nội",
    date: "2024-02-15",
    status: "pending",
    createdBy: "Nguyễn Văn A",
    createdAt: "2024-01-10",
    participants: 45,
    likes: 128,
    comments: 23,
    category: "Môi trường",
  },
  {
    id: "2",
    title: "Hỗ trợ trẻ em vùng cao",
    description: "Mang sách vở và quần áo ấm đến với trẻ em vùng cao",
    location: "Sơn La",
    date: "2024-02-20",
    status: "approved",
    createdBy: "Trần Thị B",
    createdAt: "2024-01-08",
    participants: 67,
    likes: 245,
    comments: 45,
    category: "Giáo dục",
  },
  {
    id: "3",
    title: "Dọn dẹp bãi biển",
    description: "Làm sạch bãi biển và nâng cao nhận thức về môi trường",
    location: "Đà Nẵng",
    date: "2024-02-18",
    status: "pending",
    createdBy: "Lê Văn C",
    createdAt: "2024-01-12",
    participants: 89,
    likes: 312,
    comments: 56,
    category: "Môi trường",
  },
  {
    id: "4",
    title: "Hiến máu nhân đạo",
    description: "Chiến dịch hiến máu cứu người",
    location: "TP.HCM",
    date: "2024-02-25",
    status: "approved",
    createdBy: "Phạm Thị D",
    createdAt: "2024-01-05",
    participants: 156,
    likes: 489,
    comments: 78,
    category: "Y tế",
  },
  {
    id: "5",
    title: "Xây nhà tình thương",
    description: "Xây dựng nhà cho hộ nghèo",
    location: "Cần Thơ",
    date: "2024-03-01",
    status: "pending",
    createdBy: "Hoàng Văn E",
    createdAt: "2024-01-15",
    participants: 34,
    likes: 167,
    comments: 29,
    category: "Xã hội",
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: "event_manager",
    status: "active",
    joinedAt: "2023-06-15",
    eventsJoined: 12,
    eventsCreated: 5,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    role: "event_manager",
    status: "active",
    joinedAt: "2023-07-20",
    eventsJoined: 8,
    eventsCreated: 3,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@email.com",
    role: "volunteer",
    status: "active",
    joinedAt: "2023-08-10",
    eventsJoined: 15,
    eventsCreated: 0,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    role: "volunteer",
    status: "locked",
    joinedAt: "2023-09-05",
    eventsJoined: 6,
    eventsCreated: 0,
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    role: "event_manager",
    status: "active",
    joinedAt: "2023-10-12",
    eventsJoined: 10,
    eventsCreated: 4,
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalEvents: 48,
  pendingEvents: 12,
  totalUsers: 1247,
  activeVolunteers: 892,
  newEventsThisWeek: 8,
  popularEvents: 15,
};

// Mock chart data
export const mockEventTrendData = [
  { date: "01/01", events: 12, participants: 234 },
  { date: "01/08", events: 15, participants: 289 },
  { date: "01/15", events: 18, participants: 356 },
  { date: "01/22", events: 14, participants: 298 },
  { date: "01/29", events: 20, participants: 412 },
  { date: "02/05", events: 22, participants: 445 },
  { date: "02/12", events: 25, participants: 523 },
];

export const mockCategoryData = [
  { category: "Môi trường", count: 15, fill: "var(--color-chart-1)" },
  { category: "Giáo dục", count: 12, fill: "var(--color-chart-2)" },
  { category: "Y tế", count: 8, fill: "var(--color-chart-3)" },
  { category: "Xã hội", count: 10, fill: "var(--color-chart-4)" },
  { category: "Khác", count: 3, fill: "var(--color-chart-5)" },
];

export interface Notification {
  id: string;
  type: "event" | "user" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "event",
    title: "Sự kiện mới chờ duyệt",
    message: "Nguyễn Văn A đã tạo sự kiện 'Chiến dịch Trồng cây xanh 2024'",
    time: "5 phút trước",
    read: false,
    link: "/events",
  },
  {
    id: "2",
    type: "event",
    title: "Sự kiện mới chờ duyệt",
    message: "Lê Văn C đã tạo sự kiện 'Dọn dẹp bãi biển'",
    time: "15 phút trước",
    read: false,
    link: "/events",
  },
  {
    id: "3",
    type: "user",
    title: "Người dùng mới đăng ký",
    message: "5 tình nguyện viên mới đã đăng ký tài khoản",
    time: "1 giờ trước",
    read: false,
    link: "/users",
  },
  {
    id: "4",
    type: "event",
    title: "Sự kiện sắp diễn ra",
    message: "Sự kiện 'Hiến máu nhân đạo' sẽ diễn ra trong 2 ngày nữa",
    time: "2 giờ trước",
    read: true,
    link: "/events",
  },
  {
    id: "5",
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống đã được cập nhật phiên bản mới",
    time: "1 ngày trước",
    read: true,
  },
];
