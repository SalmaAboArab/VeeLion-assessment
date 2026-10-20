import Link from "next/link";
import styles from "./module-card.module.css";

type ModuleCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
  label: string;
};

export function ModuleCard({
  title,
  description,
  href,
  icon,
  label,
}: ModuleCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>

        <span className={styles.label}>{label}</span>
      </div>

      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.cardFooter}>
        <span>Open module</span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}