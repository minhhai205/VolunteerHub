import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    name: string;
    description: string;
    location: string;
    date: string;
  } | null;
}

export default function EventDetailDialog({
  open,
  onOpenChange,
  event,
}: EventDetailDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>Địa điểm: {event.location}</p>
          <p>Ngày tổ chức: {event.date}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
