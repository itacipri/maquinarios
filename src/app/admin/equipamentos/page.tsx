import Link from 'next/link';
import { Eye, Star, MapPin, Plus, Pencil, Trash2, Database } from 'lucide-react';
import { getAllListingsAdmin } from '@/lib/listings';
import DeleteListingButton from '@/components/admin/DeleteListingButton';
import SeedButton from '@/components/admin/SeedButton';
import styles from './page.module.css';

const conditionLabel: Record<string, string> = {
  new: 'Novo', used: 'Usado', reconditioned: 'Recondicionado',
};
const conditionClass: Record<string, string> = {
  new: 'badge-new', used: 'badge-used', reconditioned: 'badge-reconditioned',
};
const statusLabel: Record<string, string> = {
  active: 'Ativo', sold: 'Vendido', reserved: 'Reservado', inactive: 'Inativo',
};
const statusClass: Record<string, string> = {
  active: styles.statusActive,
  sold: styles.statusSold,
  reserved: styles.statusReserved,
  inactive: styles.statusInactive,
};

export const dynamic = 'force-dynamic';

export default async function AdminEquipamentosPage() {
  const listings = await getAllListingsAdmin();

  const totals = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    featured: listings.filter(l => l.featured).length,
    leads: listings.reduce((s, l) => s + l.leads_count, 0),
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Equipamentos</h1>
          <p className={styles.subtitle}>{totals.total} cadastros no total</p>
        </div>
        <div className={styles.headerActions}>
          <SeedButton />
          <Link href="/admin/equipamentos/novo" className="btn btn-primary">
            <Plus size={16} /> Novo Equipamento
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <div className={`card ${styles.summaryCard}`}>
          <span className={styles.summaryValue}>{totals.total}</span>
          <span className={styles.summaryLabel}>Total</span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={`${styles.summaryValue} ${styles.orange}`}>{totals.active}</span>
          <span className={styles.summaryLabel}>Ativos</span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={`${styles.summaryValue} ${styles.amber}`}>{totals.featured}</span>
          <span className={styles.summaryLabel}>Destaques</span>
        </div>
        <div className={`card ${styles.summaryCard}`}>
          <span className={`${styles.summaryValue} ${styles.blue}`}>{totals.leads}</span>
          <span className={styles.summaryLabel}>Leads totais</span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Local</th>
              <th>Status</th>
              <th>Leads</th>
              <th>Views</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  Nenhum equipamento cadastrado ainda.{' '}
                  <button onClick={undefined} style={{display:'none'}} />
                  Use o botão <strong>Seed</strong> para popular com dados de exemplo.
                </td>
              </tr>
            )}
            {listings.map(listing => (
              <tr key={listing.id}>
                <td>
                  <div className={styles.listingCell}>
                    <span className={styles.listingTitle}>{listing.title}</span>
                    <div className={styles.listingMeta}>
                      <span className={`badge ${conditionClass[listing.condition]}`}>
                        {conditionLabel[listing.condition]}
                      </span>
                      {listing.featured && (
                        <span className={styles.featuredBadge}>
                          <Star size={10} /> Destaque
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className={styles.category}>{listing.category}</td>
                <td className={styles.price}>{listing.price_display}</td>
                <td>
                  <span className={styles.location}>
                    <MapPin size={12} aria-hidden="true" />
                    {listing.location_city}, {listing.location_state}
                  </span>
                </td>
                <td>
                  <span className={`${styles.status} ${statusClass[listing.status]}`}>
                    {statusLabel[listing.status]}
                  </span>
                </td>
                <td className={styles.center}>{listing.leads_count}</td>
                <td className={styles.center}>
                  <span className={styles.views}><Eye size={12} /> {listing.views}</span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <Link
                      href={`/equipamentos/${listing.slug}`}
                      className="btn btn-ghost btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver anúncio"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/equipamentos/${listing.id}/editar`}
                      className="btn btn-ghost btn-sm"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteListingButton id={listing.id} title={listing.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
