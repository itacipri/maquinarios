import Link from 'next/link';
import { Wrench, Search, ArrowLeft } from 'lucide-react';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Wrench size={40} />
        </div>

        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Página não encontrada</h2>
        <p className={styles.text}>
          O equipamento ou página que você procura não existe ou foi removido.
        </p>

        <div className={styles.actions}>
          <Link href="/equipamentos" className="btn btn-primary btn-lg">
            <Search size={18} /> Ver equipamentos
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            <ArrowLeft size={18} /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
