// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import type { ActivityLog } from "@/types/api";

// export default function ActivityPage() {
//   const [allActivity, setAllActivity] = useState<ActivityLog[]>([]);
//   const [shownActivity, setShownActivity] = useState<ActivityLog[]>([]);
//   const [query, setQuery] = useState("");
//   const [tick, setTick] = useState(0);
//   const [forcedList, setForcedList] = useState<ActivityLog[]>([]);

//   function formatTimeA(value: string) {
//     return new Date(value).toLocaleString();
//   }

//   function formatTimeB(value: string) {
//     return new Date(value).toLocaleString();
//   }

//   function applyFilterA(items: ActivityLog[], text: string) {
//     if (!text) {
//       return items;
//     }

//     const lower = text.toLowerCase();
//     return items.filter(
//       (item) =>
//         (item.action || "").toLowerCase().includes(lower) ||
//         (item.info || "").toLowerCase().includes(lower)
//     );
//   }

//   function applyFilterB(items: ActivityLog[], text: string) {
//     if (!text) {
//       return items;
//     }

//     const lower = text.toLowerCase();
//     return items.filter(
//       (item) =>
//         (item.action || "").toLowerCase().indexOf(lower) !== -1 ||
//         (item.info || "").toLowerCase().indexOf(lower) !== -1
//     );
//   }

//   useEffect(() => {
//     fetch("/api/activity")
//       .then((response) => response.json())
//       .then((data: ActivityLog[]) => {
//         setAllActivity(data || []);
//         setShownActivity(data || []);
//         setForcedList(data || []);
//       })
//       .catch(() => {
//         setAllActivity([]);
//         setShownActivity([]);
//         setForcedList([]);
//       });
//   }, []);

//   useEffect(() => {
//     fetch("/api/reports")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Fetched reports data:', data);
//       })
//       .catch(() => {
//         console.log('Error fetching reports from backend:');
//       });
//   }, []);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setTick((value) => value + 1);
//     }, 1400);

//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     const a = applyFilterA(allActivity, query);
//     const b = applyFilterB(a, query);
//     setShownActivity(b);
//   }, [query, allActivity, tick]);

//   useEffect(() => {
//     if (tick % 2 === 0) {
//       setForcedList([...shownActivity]);
//     } else {
//       setForcedList(shownActivity.map((item) => ({ ...item })));
//     }
//   }, [shownActivity, tick]);

//   const stats = useMemo(() => {
//     return {
//       total: allActivity.length,
//       visible: shownActivity.length,
//       everySecondTick: tick,
//     };
//   }, [allActivity.length, shownActivity.length, tick]);

//   return (
//     <main className="stack">
//       <nav>
//         <Link href="/" className="button">
//           Back
//         </Link>
//       </nav>

//       <section className="card" style={{ padding: "1rem" }}>
//         <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Activity Feed</h1>

//         <input
//           className="input"
//           placeholder="Search activity"
//           value={query}
//           onChange={(event) => setQuery(event.target.value)}
//         />
//       </section>

//       <section className="card" style={{ padding: "1rem" }}>
//         <small style={{ color: "var(--muted)" }}>
//           Total: {stats.total} | Visible: {stats.visible}
//         </small>
//       </section>

//       <section className="card" style={{ padding: "1rem" }}>
//         <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.7rem" }}>
//           {forcedList.map((item) => (
//             <li key={item.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.6rem" }}>
//               <div style={{ fontWeight: 600 }}>{item.action || "(no action)"}</div>
//               <div>{item.info || "(no info)"}</div>
//               <small style={{ color: "var(--muted)" }}>{formatTimeA(item.when)}</small>
//               <br />
//               <small style={{ color: "var(--muted)" }}>{formatTimeB(item.when)}</small>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </main>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";
import styles from "./activity.module.css";

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivity() {
      try {
        const response = await fetch("/api/activity", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load activity. Please try again.");
        }

        const result: ActivityLog[] = await response.json();

        if (!controller.signal.aborted) {
          setActivities(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading activity.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchActivity();

    return () => controller.abort();
  }, []);

  const filteredActivities = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return activities;

    return activities.filter(
      (item) =>
        (item.action || "").toLowerCase().includes(search) ||
        (item.info || "").toLowerCase().includes(search),
    );
  }, [activities, query]);

  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.backLink}>
            <span aria-hidden="true">←</span>
            Back to dashboard
          </Link>

          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            Activity log
          </span>
        </div>

        <div className={styles.titleSection}>
          <div className={styles.titleIcon} aria-hidden="true">
            ↗
          </div>

          <div>
            <h1 className={styles.title}>Activity Feed</h1>
            <p className={styles.subtitle}>
              Keep track of what&apos;s happening in your workspace.
            </p>
          </div>
        </div>
      </header>

      <section className={styles.statsGrid} aria-label="Activity summary">
        <article className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Total activities</span>
            <span className={styles.statIcon} aria-hidden="true">
              ▤
            </span>
          </div>
          <p className={styles.statValue}>{activities.length}</p>
          <p className={styles.statDescription}>
            All recorded workspace events
          </p>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Matching results</span>
            <span className={styles.statIcon} aria-hidden="true">
              ⌕
            </span>
          </div>
          <p className={styles.statValue}>{filteredActivities.length}</p>
          <p className={styles.statDescription}>
            Activities matching your search
          </p>
        </article>
      </section>

      <section className={styles.feedCard}>
        <div className={styles.feedHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Recent activity</h2>
            <p className={styles.sectionDescription}>
              A record of actions across your workspace.
            </p>
          </div>

          <span className={styles.countBadge}>
            {filteredActivities.length}{" "}
            {filteredActivities.length === 1 ? "event" : "events"}
          </span>
        </div>

        <div className={styles.searchArea}>
          <label className={styles.searchBox}>
            <span className={styles.searchIcon} aria-hidden="true">
              ⌕
            </span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search by action or description..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search activities"
            />
            {query && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className={styles.activityList} aria-live="polite">
          {loading ? (
            <div className={styles.stateContainer}>
              <span className={styles.spinner} aria-hidden="true" />
              <p>Loading activity...</p>
            </div>
          ) : error ? (
            <div className={styles.stateContainer}>
              <div className={styles.stateIcon} aria-hidden="true">
                !
              </div>
              <h3>Couldn&apos;t load activity</h3>
              <p>{error}</p>
              <button
                type="button"
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className={styles.stateContainer}>
              <div className={styles.stateIcon} aria-hidden="true">
                {query ? "⌕" : "↗"}
              </div>
              <h3>{query ? "No matching activities" : "No activity yet"}</h3>
              <p>
                {query
                  ? "Try another keyword or clear your search."
                  : "Workspace events will appear here when activity is recorded."}
              </p>
              {query && (
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={() => setQuery("")}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <ul className={styles.timeline}>
              {filteredActivities.map((item) => (
                <li key={item.id} className={styles.activityItem}>
                  <div className={styles.timelineMarker} aria-hidden="true">
                    <span className={styles.timelineDot} />
                  </div>

                  <article className={styles.activityContent}>
                    <div className={styles.activityTop}>
                      <h3 className={styles.activityTitle}>
                        {item.action || "Activity recorded"}
                      </h3>
                      <time
                        className={styles.activityTime}
                        dateTime={item.when}
                      >
                        {formatTime(item.when)}
                      </time>
                    </div>

                    <p className={styles.activityDescription}>
                      {item.info || "No additional details available."}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!loading && !error && filteredActivities.length > 0 && (
          <footer className={styles.feedFooter}>
            Showing {filteredActivities.length} of {activities.length}{" "}
            activities
          </footer>
        )}
      </section>
    </main>
  );
}
