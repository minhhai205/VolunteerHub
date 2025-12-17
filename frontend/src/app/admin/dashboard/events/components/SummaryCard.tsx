import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar, Check, XCircle } from "lucide-react";
import { useStatistics } from "../hooks/useStatistics";

export default function SummaryCard() {
  const { adminStats, eventStats, loading } = useStatistics();

  const pending = eventStats?.totalPending ?? 0;
  const approved = eventStats?.totalApproved ?? 0;
  const rejected = eventStats?.totalRejected ?? 0;
  const totalEvents = eventStats?.totalEvents ?? adminStats?.totalEvents ?? 0;

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Chờ duyệt
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {loading ? "..." : pending}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Đã duyệt
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {loading ? "..." : approved}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Đã từ chối
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {loading ? "..." : rejected}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tổng sự kiện
              </p>
              <p className="text-3xl font-bold text-foreground">
                {loading ? "..." : totalEvents}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
