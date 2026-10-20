import { ModuleCard } from "@/components/ModuleCard";
import styles from "./home.module.css";

const MODULES = [
  {
    title: "Task Dashboard",
    description:
      "Manage tasks, track completion status, and keep your work organized.",
    href: "/tasks",
    icon: "✓",
    label: "TASKS",
  },
  {
    title: "Activity Feed",
    description:
      "Review recent activity and search through recorded events.",
    href: "/activity",
    icon: "↗",
    label: "ACTIVITY",
  },
  {
    title: "Reports UI",
    description:
      "Explore the reports interface and access reporting features.",
    href: "/reports",
    icon: "▤",
    label: "REPORTS",
  },
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>VEELION · ASSESSMENT</span>

        <h1 className={styles.title}>Your workspace</h1>

        <p className={styles.subtitle}>
          Explore the assessment modules in one place. Each module connects to
          the provided backend.
        </p>
      </header>

      <section className={styles.modulesSection} aria-labelledby="modules-title">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="modules-title" className={styles.sectionTitle}>
              Assessment modules
            </h2>
            <p className={styles.sectionDescription}>
              Select a module to get started.
            </p>
          </div>

          <span className={styles.moduleCount}>03 modules</span>
        </div>

        <div className={styles.moduleGrid}>
          {MODULES.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footerDot} aria-hidden="true" />
        Frontend Assessment
        <span className={styles.footerDivider}>·</span>
        Three modules available
      </footer>
    </main>
  );
}