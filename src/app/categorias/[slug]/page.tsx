import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { mockCategories } from '@/data/mock';
import { getActiveListings } from '@/lib/listings';
import ListingCard from '@/components/listing/ListingCard';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = mockCategories.find(c => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | Maquinários`,
    description: cat.description,
  };
}

export default async function CategoriaSlugPage({ params }: Props) {
  const { slug } = await params;
  const category = mockCategories.find(c => c.slug === slug);

  if (!category) notFound();

  const allListings = await getActiveListings();
  const listings = allListings.filter(l => l.category === category.name);

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Início</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/categorias">Categorias</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{category.name}</span>
          </nav>
        </div>
      </div>

      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>{category.name}</h1>
          <p className={styles.pageSubtitle}>{category.description}</p>

          {category.subcategories.length > 0 && (
            <div className={styles.subcategories}>
              {category.subcategories.map(sub => (
                <Link
                  key={sub.slug}
                  href={`/equipamentos?categoria=${category.slug}&subcategoria=${sub.slug}`}
                  className={styles.subTag}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className={styles.resultsHeader}>
          <p className={styles.count}>
            {listings.length} {listings.length === 1 ? 'equipamento' : 'equipamentos'} disponíveis
          </p>
          <Link href={`/equipamentos?categoria=${category.slug}`} className="btn btn-ghost btn-sm">
            Ver com filtros
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>Nenhum equipamento disponível nesta categoria no momento.</p>
            <Link href="/equipamentos" className="btn btn-secondary">Ver todos os equipamentos</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
