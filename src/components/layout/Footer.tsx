import Link from 'next/link';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
import styles from './Footer.module.css';

const categories = [
  { name: 'Metalurgia e Usinagem', slug: 'metalurgia-usinagem' },
  { name: 'Construção Civil', slug: 'construcao-civil' },
  { name: 'Agrícola', slug: 'agricola' },
  { name: 'Energia e Elétrica', slug: 'energia-eletrica' },
  { name: 'Embalagem e Logística', slug: 'embalagem-logistica' },
  { name: 'Madeira e Móveis', slug: 'madeira-moveis' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}><Wrench size={18} /></span>
            <span className={styles.logoText}>MAQUIN<span className={styles.logoAccent}>ÁRIOS</span></span>
          </Link>
          <p className={styles.tagline}>
            O portal especializado em intermediação de máquinas e equipamentos industriais. Compramos e vendemos com segurança.
          </p>
          <div className={styles.social}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
              <IconInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
              <IconFacebook />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialLink}>
              <IconLinkedin />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className={styles.colTitle}>Categorias</h3>
          <ul className={styles.linkList}>
            {categories.map(cat => (
              <li key={cat.slug}>
                <Link href={`/categorias/${cat.slug}`} className={styles.footerLink}>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/categorias" className={`${styles.footerLink} ${styles.seeAll}`}>
                Ver todas →
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className={styles.colTitle}>Portal</h3>
          <ul className={styles.linkList}>
            {[
              { href: '/equipamentos', label: 'Todos os Equipamentos' },
              { href: '/sobre', label: 'Sobre Nós' },
              { href: '/vendedor', label: 'Quero Vender' },
              { href: '/contato', label: 'Contato' },
              { href: '/admin', label: 'Área Admin' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={styles.colTitle}>Contato</h3>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <Phone size={15} className={styles.contactIcon} />
              <span>(11) 99999-9999</span>
            </li>
            <li className={styles.contactItem}>
              <Mail size={15} className={styles.contactIcon} />
              <a href="mailto:contato@maquinarios.com.br" className={styles.footerLink}>
                contato@maquinarios.com.br
              </a>
            </li>
            <li className={styles.contactItem}>
              <MapPin size={15} className={styles.contactIcon} />
              <span>São Paulo, SP — Brasil</span>
            </li>
          </ul>
          <Link href="/vendedor" className={`btn btn-primary btn-sm ${styles.ctaBtn}`} id="footer-btn-vender">
            Quero Vender Meu Equipamento
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} Maquinários.com.br — Todos os direitos reservados.</p>
          <p>Intermediação profissional de máquinas e equipamentos industriais.</p>
        </div>
      </div>
    </footer>
  );
}
