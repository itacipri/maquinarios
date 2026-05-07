import Link from 'next/link';
import { MapPin, Eye, Cog, HardHat, TreePine, UtensilsCrossed, Tractor, Zap, Shirt, Package } from 'lucide-react';
import { Listing } from '@/types';
import styles from './ListingCard.module.css';

const categoryIcon: Record<string, React.ReactNode> = {
  'Metalurgia e Usinagem': <Cog size={36} />,
  'Construção Civil': <HardHat size={36} />,
  'Madeira e Móveis': <TreePine size={36} />,
  'Alimentos e Bebidas': <UtensilsCrossed size={36} />,
  'Agrícola': <Tractor size={36} />,
  'Energia e Elétrica': <Zap size={36} />,
  'Têxtil': <Shirt size={36} />,
  'Embalagem e Logística': <Package size={36} />,
};

const conditionLabel: Record<string, string> = {
  new: 'Novo',
  used: 'Usado',
  reconditioned: 'Recondicionado',
};

const conditionClass: Record<string, string> = {
  new: 'badge-new',
  used: 'badge-used',
  reconditioned: 'badge-reconditioned',
};

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  return (
    <article className={`card ${styles.card}`}>
      <Link href={`/equipamentos/${listing.slug}`} className={styles.imageWrap} aria-label={listing.title}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.imagePlaceholderIcon} aria-hidden="true">
            {categoryIcon[listing.category] ?? <Cog size={36} />}
          </span>
          <span className={styles.imagePlaceholderText}>{listing.category.split(' ')[0]}</span>
        </div>
        {listing.featured && (
          <span className={`badge badge-featured ${styles.featuredBadge}`}>★ Destaque</span>
        )}
        {listing.status === 'sold' && (
          <div className={styles.soldOverlay}>VENDIDO</div>
        )}
        {listing.status === 'reserved' && (
          <div className={`${styles.soldOverlay} ${styles.reservedOverlay}`}>RESERVADO</div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={`badge ${conditionClass[listing.condition]}`}>
            {conditionLabel[listing.condition]}
          </span>
          {listing.year && (
            <span className={styles.year}>{listing.year}</span>
          )}
        </div>

        <Link href={`/equipamentos/${listing.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{listing.title}</h3>
        </Link>

        {listing.brand && (
          <p className={styles.brand}>{listing.brand} {listing.model ? `· ${listing.model}` : ''}</p>
        )}

        <div className={styles.specs}>
          {listing.specs.power && (
            <span className={styles.spec}>{listing.specs.power}</span>
          )}
          {listing.specs.capacity && (
            <span className={styles.spec}>{listing.specs.capacity}</span>
          )}
        </div>

        <div className={styles.footer}>
          <div>
            <div className={styles.price}>
              {listing.price_display}
              {listing.price_negotiable && (
                <span className={styles.negotiable}>Negociável</span>
              )}
            </div>
            <div className={styles.location}>
              <MapPin size={12} />
              <span>{listing.location_city}, {listing.location_state}</span>
            </div>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}><Eye size={12} /> {listing.views}</span>
          </div>
        </div>

        <Link
          href={`/equipamentos/${listing.slug}`}
          className={`btn btn-primary btn-sm ${styles.ctaBtn}`}
          id={`listing-card-cta-${listing.id}`}
        >
          Ver Detalhes
        </Link>
      </div>
    </article>
  );
}
