import styles from "../../app/reports/reports.module.css";

export default function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statTop}>
        <span className={styles.statTitle}>{title}</span>
        <span className={styles.statIcon} aria-hidden="true">
          {icon}
        </span>
      </div>

      <p className={styles.statValue}>{value.toLocaleString()}</p>
      <p className={styles.statDescription}>{description}</p>
    </article>
  );
}