import styles from './loading.module.css';

export default function EquipamentosLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={`skeleton ${styles.skTitle}`} />
          <div className={`skeleton ${styles.skSubtitle}`} />
        </div>
      </div>
      <div className={`container ${styles.layout}`}>
        {/* Sidebar skeleton */}
        <aside className={styles.sidebar}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.filterGroup}>
              <div className={`skeleton ${styles.skLabel}`} />
              <div className={`skeleton ${styles.skInput}`} />
            </div>
          ))}
        </aside>
        {/* Grid skeleton */}
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`card ${styles.cardSkeleton}`}>
              <div className={`skeleton ${styles.skImage}`} />
              <div className={styles.cardBody}>
                <div className={`skeleton ${styles.skBadge}`} />
                <div className={`skeleton ${styles.skCardTitle}`} />
                <div className={`skeleton ${styles.skCardSub}`} />
                <div className={`skeleton ${styles.skCardPrice}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
