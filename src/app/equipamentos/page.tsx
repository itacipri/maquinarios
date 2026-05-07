import { Suspense } from 'react';
import { mockCategories } from '@/data/mock';
import { getActiveListings } from '@/lib/listings';
import { EquipmentCondition } from '@/types';
import ListingCard from '@/components/listing/ListingCard';
import FilterSidebar from '@/components/listing/FilterSidebar';
import Pagination from '@/components/listing/Pagination';
import styles from './page.module.css';

export const metadata = {
  title: 'Equipamentos | Maquinários',
  description: 'Catálogo completo de máquinas e equipamentos industriais à venda.',
};

const PER_PAGE = 12;

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function EquipamentosPage({ searchParams }: Props) {
  const { busca, categoria, estado, condicao, preco_min, preco_max, destaque, pagina } = await searchParams;

  const all = await getActiveListings({
    search: busca,
    category: categoria,
    state: estado,
    condition: condicao as EquipmentCondition | undefined,
    price_min: preco_min ? Number(preco_min) : undefined,
    price_max: preco_max ? Number(preco_max) : undefined,
    featured: destaque === 'true' ? true : undefined,
  });

  const currentPage = Math.max(1, Number(pagina) || 1);
  const total = all.length;
  const listings = all.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const hasFilters = !!(busca || categoria || estado || condicao || preco_min || preco_max || destaque);
  const categoryName = categoria ? mockCategories.find(c => c.slug === categoria)?.name : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>{categoryName ?? 'Todos os Equipamentos'}</h1>
          <p className={styles.pageSubtitle}>
            {total} {total === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}
            {hasFilters && ' com os filtros selecionados'}
          </p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <main className={styles.main}>
          {listings.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Nenhum equipamento encontrado.</p>
              <a href="/equipamentos" className="btn btn-secondary">Limpar filtros</a>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
              <Suspense>
                <Pagination total={total} perPage={PER_PAGE} current={currentPage} />
              </Suspense>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
