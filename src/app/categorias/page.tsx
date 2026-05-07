import Link from 'next/link';
import {
  Cog, HardHat, TreePine, UtensilsCrossed,
  Tractor, Zap, Shirt, Package, ChevronRight
} from 'lucide-react';
import { mockCategories } from '@/data/mock';
import styles from './page.module.css';

export const metadata = {
  title: 'Categorias | Maquinários',
  description: 'Navegue por todas as categorias de máquinas e equipamentos industriais.',
};

const iconMap: Record<string, React.ReactNode> = {
  Cog: <Cog size={32} />,
  HardHat: <HardHat size={32} />,
  TreePine: <TreePine size={32} />,
  UtensilsCrossed: <UtensilsCrossed size={32} />,
  Tractor: <Tractor size={32} />,
  Zap: <Zap size={32} />,
  Shirt: <Shirt size={32} />,
  Package: <Package size={32} />,
};

export default function CategoriasPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Categorias de Equipamentos</h1>
          <p className={styles.pageSubtitle}>
            Explore nosso catálogo por tipo de máquina e setor industrial
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {mockCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className={`card ${styles.card}`}
              aria-label={`Ver equipamentos de ${cat.name}`}
            >
              <div className={styles.iconWrap} aria-hidden="true">
                {iconMap[cat.icon]}
              </div>
              <div className={styles.info}>
                <h2 className={styles.name}>{cat.name}</h2>
                <p className={styles.description}>{cat.description}</p>
                <p className={styles.count}>{cat.listing_count} equipamentos</p>
              </div>

              {cat.subcategories.length > 0 && (
                <ul className={styles.subcategories}>
                  {cat.subcategories.slice(0, 4).map(sub => (
                    <li key={sub.slug} className={styles.subcategory}>
                      <ChevronRight size={12} aria-hidden="true" />
                      {sub.name}
                    </li>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <li className={styles.subcategoryMore}>
                      +{cat.subcategories.length - 4} mais
                    </li>
                  )}
                </ul>
              )}

              <span className={styles.cta}>
                Ver equipamentos <ChevronRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
