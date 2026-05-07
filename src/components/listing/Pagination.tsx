'use client';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface Props {
  total: number;
  perPage: number;
  current: number;
}

export default function Pagination({ total, perPage, current }: Props) {
  const params = useSearchParams();
  const pathname = usePathname();
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  function pageUrl(page: number) {
    const next = new URLSearchParams(params.toString());
    if (page === 1) next.delete('pagina');
    else next.set('pagina', String(page));
    const qs = next.toString();
    return `${pathname}${qs ? `?${qs}` : ''}`;
  }

  // Mostrar no máximo 7 páginas com reticências
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
    if (current < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      {current > 1 ? (
        <Link href={pageUrl(current - 1)} className={styles.btn} aria-label="Página anterior">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className={`${styles.btn} ${styles.disabled}`} aria-disabled="true"><ChevronLeft size={16} /></span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className={styles.dots}>…</span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className={`${styles.btn} ${p === current ? styles.active : ''}`}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {current < totalPages ? (
        <Link href={pageUrl(current + 1)} className={styles.btn} aria-label="Próxima página">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={`${styles.btn} ${styles.disabled}`} aria-disabled="true"><ChevronRight size={16} /></span>
      )}
    </nav>
  );
}
