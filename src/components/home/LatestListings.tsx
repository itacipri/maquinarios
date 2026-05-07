import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import { Listing } from '@/types';
import ListingCard from '@/components/listing/ListingCard';
import styles from './LatestListings.module.css';

interface Props { listings: Listing[]; }

export default function LatestListings({ listings }: Props) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              <Clock size={14} /> Recém Adicionados
            </div>
            <h2 className="section-title">Últimos Equipamentos</h2>
            <p className="section-subtitle">As novidades mais recentes do nosso catálogo</p>
          </div>
          <Link href="/equipamentos" className="btn btn-ghost" id="btn-ver-todos-equipamentos">
            Ver catálogo completo <ChevronRight size={16} />
          </Link>
        </div>
        <div className={styles.grid}>
          {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
    </section>
  );
}
