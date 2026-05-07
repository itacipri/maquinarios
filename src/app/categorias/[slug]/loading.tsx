import styles from './loading.module.css';

export default function CategoriaLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.header} />
      <div className="container">
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`card ${styles.cardSkeleton}`}>
              <div className={`skeleton ${styles.skImage}`} />
              <div className={styles.body}>
                <div className={`skeleton ${styles.skBadge}`} />
                <div className={`skeleton ${styles.skTitle}`} />
                <div className={`skeleton ${styles.skPrice}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
