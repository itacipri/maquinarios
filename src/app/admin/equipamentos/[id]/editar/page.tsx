import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAllListingsAdmin } from '@/lib/listings';
import ListingForm from '@/components/admin/ListingForm';
import styles from '../../novo/page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listings = await getAllListingsAdmin();
  const listing = listings.find(l => l.id === id);
  return { title: listing ? `Editar: ${listing.title} | Admin` : 'Editar Equipamento | Admin' };
}

export default async function AdminEditarEquipamentoPage({ params }: Props) {
  const { id } = await params;
  const listings = await getAllListingsAdmin();
  const listing = listings.find(l => l.id === id);

  if (!listing) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/equipamentos" className="btn btn-ghost btn-sm">
          <ChevronLeft size={16} /> Voltar
        </Link>
        <h1 className={styles.title}>Editar: {listing.title}</h1>
      </div>
      <ListingForm listing={listing} />
    </div>
  );
}
