"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskList } from "@/components/tasks/TaskList";
import styles from "../../app/tasks/tasks.module.css";

export function TaskDashboard() {
  const {
    filteredTasks,
    filter,
    loading,
    error,
    updatingTaskId,
    setFilter,
    fetchTasks,
    updateTaskStatus,
  } = useTasks();

  const handleToggle = (task: Task) => {
    updateTaskStatus(task.id, !task.completed);
  };

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>WORKSPACE</span>
          <h1 className={styles.title}>Task Dashboard</h1>
          <p className={styles.subtitle}>
            Manage your tasks and keep track of your progress.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={fetchTasks}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className={styles.filterSection}>
        <div className={styles.sectionHeading}>
          <h2>My Tasks</h2>
          <span className={styles.taskCount}>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        <StatusFilter value={filter} onChange={setFilter} />
      </section>

      {loading && (
        <section className={styles.stateCard} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Loading your tasks...</p>
        </section>
      )}

      {!loading && error && (
        <section className={styles.errorCard} role="alert">
          <div className={styles.stateIcon} aria-hidden="true">
            !
          </div>
          <div className={styles.stateContent}>
            <h3>Couldn't load your tasks</h3>
            <p>{error}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={fetchTasks}
            >
              Try again
            </button>
          </div>
        </section>
      )}

      {!loading && !error && (
        <TaskList
          tasks={filteredTasks}
          updatingTaskId={updatingTaskId}
          onToggle={handleToggle}
        />
      )}
    </main>
  );
}