import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Eye, Calendar, Tag, ChevronRight, Wrench } from 'lucide-react';
import { getListingBySlug, getActiveListings } from '@/lib/listings';
import InterestForm from '@/components/listing/InterestForm';
import ListingCard from '@/components/listing/ListingCard';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

const conditionLabel: Record<string, string> = { new: 'Novo', used: 'Usado', reconditioned: 'Recondicionado' };
const conditionClass: Record<string, string> = { new: 'badge-new', used: 'badge-used', reconditioned: 'badge-reconditioned' };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: `${listing.title} | Maquinários`,
    description: listing.description.slice(0, 155),
  };
}

export default async function EquipamentoDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const allActive = await getActiveListings();
  const similar = allActive
    .filter(l => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  const specEntries = Object.entries(listing.specs).filter(([, v]) => v !== undefined);

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Início</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/equipamentos">Equipamentos</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            {/* Image */}
            <div className={styles.imagePlaceholder}>
              {listing.thumbnail ? (
                <Image
                  src={listing.thumbnail}
                  alt={listing.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <>
                  <Wrench size={48} className={styles.imagePlaceholderIcon} aria-hidden="true" />
                  <span className={styles.imagePlaceholderText}>{listing.category}</span>
                </>
              )}
              {listing.featured && (
                <span className={`badge badge-featured ${styles.featuredBadge}`}>★ Destaque</span>
              )}
              {listing.status === 'sold' && <div className={styles.soldOverlay}>VENDIDO</div>}
            </div>

            {/* Title */}
            <div className={styles.titleSection}>
              <div className={styles.badges}>
                <span className={`badge ${conditionClass[listing.condition]}`}>{conditionLabel[listing.condition]}</span>
                {listing.year && <span className={styles.year}><Calendar size={13} /> {listing.year}</span>}
                <span className={styles.category}>{listing.category}</span>
              </div>
              <h1 className={styles.title}>{listing.title}</h1>
              {listing.brand && <p className={styles.brandModel}>{listing.brand}{listing.model ? ` · ${listing.model}` : ''}</p>}
            </div>

            {/* Specs */}
            {specEntries.length > 0 && (
              <div className={styles.specsSection}>
                <h2 className={styles.sectionTitle}>Especificações Técnicas</h2>
                <dl className={styles.specsList}>
                  {specEntries.map(([key, value]) => (
                    <div key={key} className={styles.specItem}>
                      <dt className={styles.specKey}>{specKeyLabel(key)}</dt>
                      <dd className={styles.specValue}>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Description */}
            <div className={styles.descSection}>
              <h2 className={styles.sectionTitle}>Descrição</h2>
              <p className={styles.description}>{listing.description}</p>
            </div>

            {listing.tags.length > 0 && (
              <div className={styles.tagsSection}>
                <Tag size={14} className={styles.tagIcon} aria-hidden="true" />
                {listing.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.priceCard}>
              <div className={styles.price}>
                {listing.price_display}
                {listing.price_negotiable && <span className={styles.negotiable}>Negociável</span>}
              </div>
              <div className={styles.location}><MapPin size={14} /> {listing.location_city}, {listing.location_state}</div>
              <div className={styles.stats}><Eye size={13} /> {listing.views} visualizações</div>
            </div>

            <InterestForm listingId={listing.id} listingTitle={listing.title} />

            <a
              href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no equipamento: ${encodeURIComponent(listing.title)}`}
              target="_blank" rel="noopener noreferrer"
              className={`btn btn-secondary ${styles.whatsappBtn}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chamar no WhatsApp
            </a>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className={styles.similar}>
            <h2 className={styles.similarTitle}>Equipamentos Similares</h2>
            <div className={styles.similarGrid}>
              {similar.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function specKeyLabel(key: string): string {
  const map: Record<string, string> = {
    power: 'Potência', weight_kg: 'Peso (kg)', dimensions: 'Dimensões',
    voltage: 'Tensão', rpm: 'Rotação (RPM)', capacity: 'Capacidade',
  };
  return map[key] ?? key.replace(/_/g, ' ');
}
