"use client";

import { FilterChip } from "@/components/ui";

const SORT_OPTIONS = ["Next Renewal", "Name", "Amount"];
const STATUS_OPTIONS = ["Any Status", "Active", "Trial", "Paused"];

interface SubscriptionFiltersProps {
  sortBy: string;
  category: string;
  status: string;
  categories: string[];
  onSortChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export function SubscriptionFilters({
  sortBy,
  category,
  status,
  categories,
  onSortChange,
  onCategoryChange,
  onStatusChange,
}: SubscriptionFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <FilterChip
        label="Sort By"
        value={sortBy}
        options={SORT_OPTIONS}
        onChange={onSortChange}
      />
      <FilterChip
        label="Category"
        value={category}
        options={["All Services", ...categories]}
        onChange={onCategoryChange}
      />
      <FilterChip
        label="Status"
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
      />
    </div>
  );
}
