'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Wrench, LayoutDashboard, Package, Users, LogOut, Menu, X } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './AdminGuard.module.css';

const NAV = [
  { href: '/admin/equipamentos', icon: <Package size={18} />, label: 'Equipamentos' },
  { href: '/admin/leads', icon: <Users size={18} />, label: 'Leads' },
];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      if (!user && !isLoginPage) router.replace('/admin/login');
    });
    return unsubscribe;
  }, [isLoginPage, router]);

  async function logout() {
    await signOut(auth);
    router.push('/admin/login');
  }

  // Login page — sem layout
  if (isLoginPage) return <>{children}</>;

  // Aguardando verificação
  if (authed === null) return null;

  if (!authed) return null;

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <Wrench size={18} />
          <span>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin/equipamentos" className={`${styles.navLink} ${pathname.startsWith('/admin/equipamentos') ? styles.active : ''}`}>
            <LayoutDashboard size={18} aria-hidden="true" />
            Equipamentos
          </Link>
          <Link href="/admin/leads" className={`${styles.navLink} ${pathname.startsWith('/admin/leads') ? styles.active : ''}`}>
            <Users size={18} aria-hidden="true" />
            Leads
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.siteLink}>← Ver site</Link>
          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={16} aria-hidden="true" /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className={styles.topbarTitle}>
            {NAV.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'}
          </span>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </div>
  );
}
