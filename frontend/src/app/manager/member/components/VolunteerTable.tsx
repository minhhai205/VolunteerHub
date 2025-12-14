"use client";

import { Checkbox } from "@/components/ui/checkbox";
import VolunteerRow from "./VolunteerRow";
import styles from "./VolunteerTable.module.css";

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  registeredDate: string;
  status: string;
  phone: string;
  hours: number;
}

interface VolunteerTableProps {
  volunteers: Volunteer[];
  selectedVolunteers: number[];
  onSelectAll: () => void;
  onSelectVolunteer: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  isLoading?: boolean;
}

export default function VolunteerTable({
  volunteers,
  selectedVolunteers,
  onSelectAll,
  onSelectVolunteer,
  onUpdateStatus,
  isLoading = false,
}: VolunteerTableProps) {
  const allPending = volunteers.length > 0 && volunteers.every(v => v.status.toLowerCase() === "pending");
  
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCell}>
              <Checkbox
                checked={
                  volunteers.length > 0 &&
                  volunteers.filter(v => v.status.toLowerCase() === "pending").length > 0 &&
                  volunteers.filter(v => v.status.toLowerCase() === "pending").every(v => selectedVolunteers.includes(v.id))
                }
                onCheckedChange={onSelectAll}
              />
            </th>
            <th>Tình nguyện viên</th>
            <th>Sự kiện</th>
            <th>Ngày đăng ký</th>
            <th>Giờ tham gia</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody className={isLoading ? styles.loadingRows : ""}>
          {volunteers.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                <p className={styles.emptyText}>
                  Không tìm thấy tình nguyện viên nào
                </p>
              </td>
            </tr>
          ) : (
            volunteers.map((volunteer) => (
              <VolunteerRow
                key={volunteer.id}
                volunteer={volunteer}
                isSelected={selectedVolunteers.includes(volunteer.id)}
                onSelect={onSelectVolunteer}
                onUpdateStatus={onUpdateStatus}
                isLoading={isLoading}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
