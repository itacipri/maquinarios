import styles from './StatsBar.module.css';

const stats = [
  { value: '217', label: 'Equipamentos Ativos', suffix: '+' },
  { value: '89', label: 'Negociações Realizadas', suffix: '+' },
  { value: '24', label: 'Estados Atendidos', suffix: '' },
  { value: '100', label: 'Satisfação dos Clientes', suffix: '%' },
];

export default function StatsBar() {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.grid}`}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.value}>{stat.value}<span className={styles.suffix}>{stat.suffix}</span></span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
