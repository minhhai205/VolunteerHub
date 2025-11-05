"use client";

import { useState } from "react";
import EventRequestHeader from "./event-request-header";
import EventRequestList from "./event-request-list";
import styles from "./styles/event-requests.module.css";

const mockRequests = [
  {
    id: 1,
    userName: "Nguyễn Văn A",
    userEmail: "nguyenvana@email.com",
    eventId: "EVT-2024-001",
    eventName: "Lễ hội tình nguyện viên 2024",
    registeredDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    userName: "Trần Thị B",
    userEmail: "tranthib@email.com",
    eventId: "EVT-2024-002",
    eventName: "Chương trình dọn dẹp môi trường",
    registeredDate: "2024-01-14",
    status: "approved",
  },
  {
    id: 3,
    userName: "Lê Minh C",
    userEmail: "leminc@email.com",
    eventId: "EVT-2024-001",
    eventName: "Lễ hội tình nguyện viên 2024",
    registeredDate: "2024-01-13",
    status: "pending",
  },
  {
    id: 4,
    userName: "Phạm Hồng D",
    userEmail: "phamhond@email.com",
    eventId: "EVT-2024-003",
    eventName: "Dạy kèm học sinh khó khăn",
    registeredDate: "2024-01-12",
    status: "rejected",
  },
  {
    id: 5,
    userName: "Hoàng Anh E",
    userEmail: "hoangahe@email.com",
    eventId: "EVT-2024-002",
    eventName: "Chương trình dọn dẹp môi trường",
    registeredDate: "2024-01-11",
    status: "approved",
  },
];

export default function EventRequestsManager() {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (id: number) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = (id: number) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <div className={styles.container}>
      <EventRequestHeader totalRequests={requests.length} />
      <EventRequestList
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
