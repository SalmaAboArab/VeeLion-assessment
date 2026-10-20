import React from "react";
import styles from "../../app/reports/reports.module.css";

const STATUS_STYLES: Record<string, string> = {
  todo: "todo",
  "in-progress": "progress",
  done: "done",
};

const formatStatus = (status: string) =>
  status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function StatusBars({
  data,
  total,
}: {
  data: ReportsData;
  total: number;
}) {
  return (
    <div className={styles.statusList}>
      {Object.entries(data.byStatus ?? {}).map(([status, count]) => {
        const percentage = Math.min(100, Math.max(0, (count / total) * 100));

        const statusStyle = STATUS_STYLES[status] ?? "defaultStatus";

        return (
          <article key={status} className={styles.statusCard}>
            <div className={styles.statusInfo}>
              <div className={styles.statusName}>
                <span
                  className={`${styles.statusDot} ${styles[statusStyle]}`}
                />
                <span>{formatStatus(status)}</span>
              </div>

              <span className={styles.statusCount}>
                {count.toLocaleString()}
                <span className={styles.statusPercent}>
                  {" "}
                  · {percentage.toFixed(0)}%
                </span>
              </span>
            </div>

            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label={`${formatStatus(status)} tasks`}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`${styles.progressFill} ${styles[statusStyle]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
