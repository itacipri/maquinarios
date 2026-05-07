import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { Listing } from '@/types';
import ListingCard from '@/components/listing/ListingCard';
import styles from './FeaturedListings.module.css';

interface Props { listings: Listing[]; }

export default function FeaturedListings({ listings }: Props) {
  if (!listings.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              <Star size={14} fill="currentColor" /> Anúncios em Destaque
            </div>
            <h2 className="section-title">Equipamentos Selecionados</h2>
            <p className="section-subtitle">Oportunidades especiais curadas pela nossa equipe</p>
          </div>
          <Link href="/equipamentos?destaque=true" className="btn btn-ghost" id="btn-ver-destaques">
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>
        <div className={styles.grid}>
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
    </section>
  );
}
