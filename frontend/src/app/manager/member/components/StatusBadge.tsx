import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "completed":
      return (
        <Badge className={styles.completed}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Hoàn thành
        </Badge>
      );
    case "pending":
      return (
        <Badge className={styles.pending}>
          <Clock className="w-3 h-3 mr-1" />
          Chờ xác nhận
        </Badge>
      );
    case "absent":
      return (
        <Badge className={styles.absent}>
          <XCircle className="w-3 h-3 mr-1" />
          Vắng mặt
        </Badge>
      );
    default:
      return null;
  }
}
