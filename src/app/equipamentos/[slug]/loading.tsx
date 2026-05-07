import styles from './loading.module.css';

export default function EquipamentoDetailLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbBar} />
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={`skeleton ${styles.skImage}`} />
            <div className={styles.badges}>
              <div className={`skeleton ${styles.skBadge}`} />
              <div className={`skeleton ${styles.skBadge}`} />
            </div>
            <div className={`skeleton ${styles.skTitle}`} />
            <div className={`skeleton ${styles.skSub}`} />
            <div className={styles.specs}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`skeleton ${styles.skSpec}`} />
              ))}
            </div>
            <div className={`skeleton ${styles.skDesc}`} />
            <div className={`skeleton ${styles.skDesc2}`} />
          </div>
          <aside className={styles.sidebar}>
            <div className={`skeleton ${styles.skPriceCard}`} />
            <div className={`skeleton ${styles.skForm}`} />
          </aside>
        </div>
      </div>
    </div>
  );
}
