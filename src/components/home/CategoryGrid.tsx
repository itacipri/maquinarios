import Link from 'next/link';
import {
  Cog, HardHat, TreePine, UtensilsCrossed,
  Tractor, Zap, Shirt, Package, ChevronRight
} from 'lucide-react';
import { Category } from '@/types';
import styles from './CategoryGrid.module.css';

const iconMap: Record<string, React.ReactNode> = {
  Cog: <Cog size={28} />,
  HardHat: <HardHat size={28} />,
  TreePine: <TreePine size={28} />,
  UtensilsCrossed: <UtensilsCrossed size={28} />,
  Tractor: <Tractor size={28} />,
  Zap: <Zap size={28} />,
  Shirt: <Shirt size={28} />,
  Package: <Package size={28} />,
};

interface Props { categories: Category[]; }

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className="section-title">Categorias de Equipamentos</h2>
            <p className="section-subtitle">Encontre exatamente o que precisa por tipo de máquina</p>
          </div>
          <Link href="/categorias" className="btn btn-ghost" id="btn-ver-categorias">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>

        <div className={styles.grid}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className={styles.card}
              id={`category-card-${cat.slug}`}
              aria-label={`Ver equipamentos de ${cat.name}`}
            >
              <div className={styles.iconWrap} aria-hidden="true">
                {iconMap[cat.icon]}
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{cat.name}</h3>
                <p className={styles.count}>{cat.listing_count} equipamentos</p>
              </div>
              <ChevronRight size={16} className={styles.arrow} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
