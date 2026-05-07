'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { mockCategories } from '@/data/mock';
import styles from './FilterSidebar.module.css';

const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }, [params, pathname, router]);

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const hasFilters = params.toString().length > 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        {hasFilters && (
          <button onClick={clearAll} className={styles.clearBtn} type="button">
            <X size={14} /> Limpar
          </button>
        )}
      </div>

      <div className={styles.group}>
        <label className="label" htmlFor="filter-busca">Busca</label>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} aria-hidden="true" />
          <input
            id="filter-busca"
            className={`input ${styles.searchInput}`}
            type="text"
            placeholder="Marca, modelo, palavra-chave..."
            defaultValue={params.get('busca') ?? ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') update('busca', (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => update('busca', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className="label" htmlFor="filter-categoria">Categoria</label>
        <select
          id="filter-categoria"
          className="input"
          value={params.get('categoria') ?? ''}
          onChange={(e) => update('categoria', e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {mockCategories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className="label" htmlFor="filter-estado">Estado</label>
        <select
          id="filter-estado"
          className="input"
          value={params.get('estado') ?? ''}
          onChange={(e) => update('estado', e.target.value)}
        >
          <option value="">Todos os estados</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className="label" htmlFor="filter-condicao">Condição</label>
        <select
          id="filter-condicao"
          className="input"
          value={params.get('condicao') ?? ''}
          onChange={(e) => update('condicao', e.target.value)}
        >
          <option value="">Qualquer condição</option>
          <option value="new">Novo</option>
          <option value="used">Usado</option>
          <option value="reconditioned">Recondicionado</option>
        </select>
      </div>

      <div className={styles.group}>
        <span className="label">Faixa de Preço (R$)</span>
        <div className={styles.priceRow}>
          <input
            className="input"
            type="number"
            placeholder="Mínimo"
            min={0}
            defaultValue={params.get('preco_min') ?? ''}
            onBlur={(e) => update('preco_min', e.target.value)}
          />
          <span className={styles.priceSep}>—</span>
          <input
            className="input"
            type="number"
            placeholder="Máximo"
            min={0}
            defaultValue={params.get('preco_max') ?? ''}
            onBlur={(e) => update('preco_max', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={params.get('destaque') === 'true'}
            onChange={(e) => update('destaque', e.target.checked ? 'true' : '')}
          />
          Somente destaques
        </label>
      </div>
    </aside>
  );
}
