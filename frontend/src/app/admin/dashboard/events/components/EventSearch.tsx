import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function EventSearch() {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm sự kiện..." className="pl-10" />
        </div>
      </CardContent>
    </Card>
  );
}
