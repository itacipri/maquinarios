'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Wrench } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/equipamentos?busca=${encodeURIComponent(search.trim())}`);
    }
  }

  const navLinks = [
    { href: '/equipamentos', label: 'Equipamentos' },
    { href: '/categorias', label: 'Categorias' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Maquinários - Página inicial">
            <span className={styles.logoIcon}><Wrench size={22} /></span>
            <span className={styles.logoText}>
              MAQUIN<span className={styles.logoAccent}>ÁRIOS</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className={styles.searchForm} role="search">
            <Search size={17} className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar equipamentos, marcas, modelos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar equipamentos"
            />
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {/* Nav - Desktop */}
          <nav className={styles.nav} aria-label="Navegação principal">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link href="/vendedor" className="btn btn-primary" id="btn-quero-vender">
            Quero Vender
          </Link>

          {/* Mobile toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu} role="dialog" aria-label="Menu de navegação mobile">
            <form onSubmit={handleSearch} className={styles.mobileSearch}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Buscar equipamentos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                aria-label="Buscar equipamentos"
              />
            </form>
            <nav>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={styles.mobileNavLink}>
                  {link.label}
                </Link>
              ))}
              <Link href="/vendedor" className={`btn btn-primary ${styles.mobileCtaBtn}`}>
                Quero Vender
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
