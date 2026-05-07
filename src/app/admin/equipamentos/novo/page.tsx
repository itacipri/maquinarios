import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ListingForm from '@/components/admin/ListingForm';
import styles from './page.module.css';

export const metadata = { title: 'Novo Equipamento | Admin' };

export default function AdminNovoEquipamentoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/equipamentos" className="btn btn-ghost btn-sm">
          <ChevronLeft size={16} /> Voltar
        </Link>
        <h1 className={styles.title}>Novo Equipamento</h1>
      </div>
      <ListingForm />
    </div>
  );
}
