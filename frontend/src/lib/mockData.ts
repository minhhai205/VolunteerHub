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
  fullName: string;
  email: string;
  role: {
    id: number;
    name: "USER" | "MANAGER" | "ADMIN";
    description: string;
  };
  status: "active" | "locked";
  phoneNumber?: string;
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
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: {
      id: 1,
      name: "MANAGER",
      description: "Event Manager",
    },
    status: "active",
    phoneNumber: "0123456789",
  },
  {
    id: "2",
    fullName: "Trần Thị B",
    email: "tranthib@email.com",
    role: {
      id: 1,
      name: "MANAGER",
      description: "Event Manager",
    },
    status: "active",
    phoneNumber: "0987654321",
  },
  {
    id: "3",
    fullName: "Lê Văn C",
    email: "levanc@email.com",
    role: {
      id: 1,
      name: "USER",
      description: "Event Manager",
    },
    status: "active",
    phoneNumber: "0112233445",
  },
  {
    id: "4",
    fullName: "Phạm Thị D",
    email: "phamthid@email.com",
    role: {
      id: 1,
      name: "USER",
      description: "Event Manager",
    },
    status: "locked",
    phoneNumber: "0998877665",
  },
  {
    id: "5",
    fullName: "Hoàng Văn E",
    email: "hoangvane@email.com",
    role: {
      id: 1,
      name: "USER",
      description: "Event Manager",
    },
    status: "active",
    phoneNumber: "0223344556",
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

export interface EventRequestResponseDTO {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: string; // Đây là chuỗi ngày tháng theo chuẩn ISO 8601 (ISO 8601 date-time string)
  endDate: string; // Đây cũng là chuỗi ngày tháng theo chuẩn ISO 8601
  categoryNames: string[];
  status: string; // Hoặc "pending"
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

// Thêm vào file: frontend/src/lib/mockData.ts
// (Hãy xóa hoặc thay thế biến mockEventRequests cũ)

// Dữ liệu này khớp với cấu trúc EventRequestResponseDTO của backend
/* Dữ liệu này được LẤY TỪ mockEventRequests 
  nhưng đã BIẾN ĐỔI để khớp với YourMockInterface
*/
export const mockTransformedEventRequests: EventRequestResponseDTO[] = [
  {
    id: 1,
    name: "Community Blood Drive",
    description:
      "Mô tả chi tiết cho Community Blood Drive. Cần nhiều tình nguyện viên.",
    location: "National Institute of Hematology, Hanoi",
    imageUrl: "https://example.com/images/blood-drive.jpg",
    startDate: "2025-12-01T08:00:00.000Z", // Đã đổi sang ISO 8601
    endDate: "2025-12-01T17:00:00.000Z", // Đã đổi sang ISO 8601
    categoryNames: ["Healthcare"], // Đã đổi từ string sang string[]
    status: "pending", // Đã đổi sang chữ thường
  },
  {
    id: 2,
    name: "Code for Kids Workshop",
    description:
      "Mô tả chi tiết cho Code for Kids Workshop. Dạy lập trình cho trẻ em.",
    location: "Hanoi University of Science and Technology, Library",
    imageUrl: "https://example.com/images/code-workshop.jpg",
    startDate: "2025-11-22T09:00:00.000Z",
    endDate: "2025-11-22T16:00:00.000Z",
    categoryNames: ["Education"],
    status: "pending",
  },
  {
    id: 3,
    name: "Beach Cleanup at Sunrise",
    description:
      "Mô tả chi tiết cho Beach Cleanup at Sunrise. Dọn rác bãi biển.",
    location: "My Khe Beach, Da Nang",
    imageUrl: "https://example.com/images/beach-cleanup.jpg",
    startDate: "2025-11-15T06:00:00.000Z",
    endDate: "2025-11-15T09:00:00.000Z",
    categoryNames: ["Environment"],
    status: "approved", // Đã đổi sang chữ thường
  },
  {
    id: 4,
    name: "Local Park Renovation",
    description: "Mô tả chi tiết cho Local Park Renovation. Cải tạo công viên.",
    location: "Thong Nhat Park, Hanoi",
    imageUrl: "https://example.com/images/park-renovation.jpg",
    startDate: "2025-11-10T08:00:00.000Z",
    endDate: "2025-11-12T17:00:00.000Z",
    categoryNames: ["Community"],
    status: "rejected", // Đã đổi sang chữ thường
  },
];
