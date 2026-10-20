import type { Task } from "@/types/api";
import { TaskItem } from "@/components/tasks/TaskItem";
import styles from "../../app/tasks/tasks.module.css";

type TaskListProps = {
  tasks: Task[];
  updatingTaskId: string;
  onToggle: (task: Task) => void;
};

export function TaskList({
  tasks,
  updatingTaskId,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyIcon} aria-hidden="true">
          ✓
        </div>
        <h3>Nothing to see here</h3>
        <p>No tasks match this filter. Try selecting another status.</p>
      </section>
    );
  }

  return (
    <section aria-label="Task list" className={styles.taskListSection}>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            busy={updatingTaskId === task.id}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}