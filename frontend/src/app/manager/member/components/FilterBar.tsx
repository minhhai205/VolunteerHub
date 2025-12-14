"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  selectedEvent: string;
  onEventChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  events: Array<{ id: string; name: string }>;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedEvent,
  onEventChange,
  statusFilter,
  onStatusChange,
  events,
}: FilterBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(inputValue);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} />
        <Input
          placeholder="Tìm kiếm theo tên hoặc email... (ấn Enter để tìm)"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
      </div>
      <Select value={selectedEvent} onValueChange={onEventChange}>
        <SelectTrigger className={styles.selectTrigger}>
          <SelectValue placeholder="Chọn sự kiện" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả sự kiện</SelectItem>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className={styles.selectTrigger}>
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Lọc trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Chờ xác nhận</SelectItem>
          <SelectItem value="completed">Đã hoàn thành</SelectItem>
          <SelectItem value="absent">Vắng mặt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
