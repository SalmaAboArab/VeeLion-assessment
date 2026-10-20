import styles from "../../app/reports/reports.module.css";

export default function LoadingState() {
  return (
    <div className={styles.statsGrid} aria-label="Loading reports">
      {[1, 2].map((item) => (
        <div key={item} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonValue} />
          <div className={styles.skeletonLine} />
        </div>
      ))}

      <div className={`${styles.skeletonCard} ${styles.statusSkeleton}`}>
        {Array.from({ length: 3 }).map((_) => (
          <div className={styles.skeletonLine} />
        ))}
      </div>
    </div>
  );
}