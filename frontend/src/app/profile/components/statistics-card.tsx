"use client";

import { Award, Heart, Zap, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatisticsCardProps {
  volunteerHours: number;
  projectsCompleted: number;
  eventsAttended: number;
  totalTimeParticipating: string;
}

export function StatisticsCard({
  volunteerHours,
  projectsCompleted,
  eventsAttended,
  totalTimeParticipating,
}: StatisticsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-6 text-center border-primary/10 hover:border-primary/30 transition-colors">
        <div className="flex justify-center mb-4">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">
          {volunteerHours}
        </p>
        <p className="text-sm text-muted-foreground">Giờ tình nguyện</p>
      </Card>
      <Card className="p-6 text-center border-primary/10 hover:border-primary/30 transition-colors">
        <div className="flex justify-center mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">
          {projectsCompleted}
        </p>
        <p className="text-sm text-muted-foreground">Dự án hoàn thành</p>
      </Card>
      <Card className="p-6 text-center border-primary/10 hover:border-primary/30 transition-colors">
        <div className="flex justify-center mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">
          {eventsAttended}
        </p>
        <p className="text-sm text-muted-foreground">Sự kiện tham gia</p>
      </Card>
      <Card className="p-6 text-center border-primary/10 hover:border-primary/30 transition-colors">
        <div className="flex justify-center mb-4">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">
          {totalTimeParticipating}
        </p>
        <p className="text-sm text-muted-foreground">Thời gian tham gia</p>
      </Card>
    </div>
  );
}
