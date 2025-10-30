import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Calendar, Check, Search } from "lucide-react";

export default function SummaryCard() {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Chờ duyệt
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                5
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
              <p className="text-3xl font-bold text-accent">12</p>
            </div>
            <Check className="h-8 w-8 text-accent" />
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
              <p className="text-3xl font-bold text-foreground">17</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
