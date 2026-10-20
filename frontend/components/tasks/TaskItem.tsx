import type { Task } from "@/types/api";
import styles from "../../app/tasks/tasks.module.css";

type TaskItemProps = {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
};

export function TaskItem({ task, busy, onToggle }: TaskItemProps) {
  return (
    <li
      className={`${styles.taskCard} ${
        task.completed ? styles.completedTask : ""
      }`}
    >
      <div className={styles.taskMain}>
        <span
          className={`${styles.taskIndicator} ${
            task.completed ? styles.completedIndicator : ""
          }`}
          aria-hidden="true"
        />

        <div className={styles.taskDetails}>
          <h3 className={styles.taskTitle}>{task.title}</h3>

          <div className={styles.taskMeta}>
            <span
              className={`${styles.statusBadge} ${
                task.completed
                  ? styles.completedBadge
                  : styles.pendingBadge
              }`}
            >
              <span className={styles.statusDot} />
              {task.completed ? "Completed" : "Pending"}
            </span>

            <span className={styles.updatedAt}>
              Updated{" "}
              {Number.isNaN(new Date(task.updatedAt).getTime())
                ? "—"
                : new Date(task.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.taskAction} ${
          task.completed ? styles.pendingAction : ""
        }`}
        onClick={() => onToggle(task)}
        disabled={busy}
        aria-label={`Mark ${task.title} as ${
          task.completed ? "pending" : "completed"
        }`}
      >
        {busy ? (
          "Saving..."
        ) : task.completed ? (
          <>
            <span aria-hidden="true">↶</span>
            Mark pending
          </>
        ) : (
          <>
            <span aria-hidden="true">✓</span>
            Complete task
          </>
        )}
      </button>
    </li>
  );
}