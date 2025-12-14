"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./VolunteerRow.module.css";
import type { Volunteer } from "./VolunteerTable";

interface VolunteerRowProps {
  volunteer: Volunteer;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  isLoading?: boolean;
}

export default function VolunteerRow({
  volunteer,
  isSelected,
  onSelect,
  onUpdateStatus,
  isLoading = false,
}: VolunteerRowProps) {
  const isPending = volunteer.status.toLowerCase() === "pending";

  return (
    <tr className={styles.row}>
      <td className={styles.checkboxCell}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(volunteer.id)}
        />
      </td>
      <td>
        <div className={styles.volunteerInfo}>
          <Avatar className={styles.avatar}>
            <AvatarFallback className={styles.avatarFallback}>
              {volunteer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className={styles.volunteerName}>{volunteer.name}</div>
            <div className={styles.volunteerEmail}>{volunteer.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.eventName}>{volunteer.eventName}</div>
      </td>
      <td>
        <div className={styles.date}>
          {new Date(volunteer.registeredDate).toLocaleDateString("vi-VN")}
        </div>
      </td>
      <td>
        <div className={styles.hours}>{volunteer.hours} giờ</div>
      </td>
      <td>
        <StatusBadge status={volunteer.status} />
      </td>
      <td>
        <div className={styles.actionButtons}>
          {
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUpdateStatus(volunteer.id, "completed")}
              className={styles.completeButton}
              title="Đánh dấu hoàn thành"
              disabled={isLoading || !isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          }
          {
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUpdateStatus(volunteer.id, "absent")}
              className={styles.absentButton}
              title="Đánh dấu vắng mặt"
              disabled={isLoading || !isPending}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          }
        </div>
      </td>
    </tr>
  );
}
