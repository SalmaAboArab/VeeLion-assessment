import type { TaskFilter } from "@/types/api";
import styles from "../../app/tasks/tasks.module.css";

const FILTERS: Array<{ label: string; value: TaskFilter }> = [
  { label: "All tasks", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

type StatusFilterProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div
      className={styles.filterGroup}
      role="group"
      aria-label="Filter tasks by status"
    >
      {FILTERS.map((filter) => {
        const active = filter.value === value;

        return (
          <button
            key={filter.value}
            type="button"
            className={`${styles.filterButton} ${
              active ? styles.activeFilter : ""
            }`}
            onClick={() => onChange(filter.value)}
            aria-pressed={active}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}