'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import styles from './HeroSection.module.css';

const states = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('busca', query);
    if (category) params.set('categoria', category);
    if (state) params.set('estado', state);
    router.push(`/equipamentos?${params.toString()}`);
  }

  return (
    <section className={styles.hero} aria-label="Busca principal">
      {/* Background elements */}
      <div className={styles.bgGlow1} aria-hidden="true" />
      <div className={styles.bgGlow2} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          O portal especializado em equipamentos industriais
        </div>

        <h1 className={styles.title}>
          Encontre a Máquina<br />
          <span className="gradient-text">Certa para Você</span>
        </h1>

        <p className={styles.subtitle}>
          Intermediamos a compra e venda de máquinas industriais com segurança e transparência.
          Mais de <strong>217 equipamentos</strong> disponíveis em todo o Brasil.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className={styles.searchBox} role="search">
          <div className={styles.searchMain}>
            <Search size={20} className={styles.searchMainIcon} aria-hidden="true" />
            <input
              type="search"
              placeholder="Torno CNC, compressor, trator, gerador..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className={styles.searchMainInput}
              aria-label="Buscar equipamentos"
              id="hero-search-input"
            />
          </div>

          <div className={styles.searchFilters}>
            <div className={styles.selectWrap}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={styles.select}
                aria-label="Filtrar por categoria"
                id="hero-category-select"
              >
                <option value="">Todas as Categorias</option>
                <option value="metalurgia-usinagem">Metalurgia e Usinagem</option>
                <option value="construcao-civil">Construção Civil</option>
                <option value="agricola">Agrícola</option>
                <option value="energia-eletrica">Energia e Elétrica</option>
                <option value="embalagem-logistica">Embalagem e Logística</option>
                <option value="madeira-moveis">Madeira e Móveis</option>
                <option value="alimentos-bebidas">Alimentos e Bebidas</option>
                <option value="textil">Têxtil</option>
              </select>
              <ChevronDown size={15} className={styles.selectIcon} aria-hidden="true" />
            </div>

            <div className={styles.selectWrap}>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className={styles.select}
                aria-label="Filtrar por estado"
                id="hero-state-select"
              >
                <option value="">Todo o Brasil</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className={styles.selectIcon} aria-hidden="true" />
            </div>

            <button type="submit" className={`btn btn-primary btn-lg ${styles.searchBtn}`} id="hero-search-btn">
              <Search size={18} aria-hidden="true" />
              Buscar
            </button>
          </div>
        </form>

        {/* Quick tags */}
        <div className={styles.quickTags} aria-label="Buscas populares">
          <span className={styles.quickTagsLabel}>Popular:</span>
          {['Torno CNC', 'Compressor', 'Trator', 'Gerador', 'Empilhadeira', 'Fresadora'].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => router.push(`/equipamentos?busca=${encodeURIComponent(tag)}`)}
              className={styles.quickTag}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
