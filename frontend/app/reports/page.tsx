"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./reports.module.css";
import LoadingState from "@/components/reports/LoadingState";
import StatCard from "@/components/reports/StateCard";
import StatusBars from "@/components/reports/StatusBars";


export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reports", { signal });

      if (!response.ok) {
        throw new Error("Failed to load reports.");
      }

      const result = await response.json();

      if (!signal?.aborted) {
        setData(result?.data ?? null);
      }
    } catch (err) {
      if (signal?.aborted) return;

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading reports.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchReports(controller.signal);

    return () => controller.abort();
  }, [fetchReports]);

  const total = data?.total ?? 0;

  return (
    <main>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>WORKSPACE OVERVIEW</p>
          <h1 className={styles.heading}>Reports</h1>
          <p className={styles.subtitle}>
            Track your tasks and get an overview of recent activity.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => void fetchReports()}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <section className={styles.errorBox} role="alert">
          <div>
            <strong>Couldn't load reports</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            className={styles.retryButton}
            onClick={() => void fetchReports()}
            disabled={loading}
          >
            Try again
          </button>
        </section>
      )}

      {loading && !data ? (
        <LoadingState />
      ) : data ? (
        <>
          <section className={styles.statsGrid} aria-label="Report summary">
            <StatCard
              title="Total Tasks"
              value={data.total}
              description="Tasks across your workspace"
              icon="▤"
            />

            <StatCard
              title="Recent Activity"
              value={data.recentActivityCount}
              description="Activities reported by the API"
              icon="↗"
            />
          </section>

          <section className={styles.statusSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Tasks by Status</h2>
                <p className={styles.sectionSubtitle}>
                  A breakdown of your current tasks.
                </p>
              </div>

              <span className={styles.totalBadge}>
                {total.toLocaleString()} tasks
              </span>
            </div>

            {total === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  ▤
                </span>
                <h3>No tasks yet</h3>
                <p>
                  When tasks are added to your workspace, their status breakdown
                  will appear here.
                </p>
              </div>
            ) : Object.keys(data.byStatus ?? {}).length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No status breakdown available</h3>
                <p>Tasks exist, but the API returned no status statistics.</p>
              </div>
            ) : (
              <StatusBars data={data} total={total}/>
            )}
          </section>
        </>
      ) : !error ? (
        <div className={styles.emptyState}>
          <h3>No report data available</h3>
          <p>Try refreshing the page.</p>
        </div>
      ) : null}
    </main>
  );
}
