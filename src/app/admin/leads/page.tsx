'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore/lite';
import { db } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import styles from './page.module.css';

type FireLead = {
  id: string;
  listing_id?: string;
  listing_title?: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status?: string;
  source?: string;
  created_at?: Timestamp;
};

type FireContact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: Timestamp;
};

type FireVendor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  equipment_title: string;
  category: string;
  condition: string;
  brand?: string;
  model?: string;
  year?: string;
  price?: string;
  state: string;
  city: string;
  description: string;
  status?: string;
  created_at?: Timestamp;
};

type Tab = 'leads' | 'contacts' | 'vendors';

function fmt(ts?: Timestamp) {
  if (!ts) return '—';
  return ts.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

const statusLabel: Record<string, string> = {
  new: 'Novo', contacted: 'Contactado', negotiating: 'Negociando', closed: 'Fechado', lost: 'Perdido', pending: 'Pendente',
};
const statusClass: Record<string, string> = {
  new: styles.statusNew, contacted: styles.statusContacted, negotiating: styles.statusNegotiating,
  closed: styles.statusClosed, lost: styles.statusLost, pending: styles.statusNew,
};

export default function AdminLeadsPage() {
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<FireLead[]>([]);
  const [contacts, setContacts] = useState<FireContact[]>([]);
  const [vendors, setVendors] = useState<FireVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const [lSnap, cSnap, vSnap] = await Promise.all([
        getDocs(query(collection(db, 'leads'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'contacts'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'vendedor_requests'), orderBy('created_at', 'desc'))),
      ]);
      setLeads(lSnap.docs.map(d => ({ id: d.id, ...d.data() } as FireLead)));
      setContacts(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as FireContact)));
      setVendors(vSnap.docs.map(d => ({ id: d.id, ...d.data() } as FireVendor)));
      setLoading(false);
    }
    fetch();
  }, []);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'leads', label: 'Leads', count: leads.length },
    { key: 'contacts', label: 'Contatos', count: contacts.length },
    { key: 'vendors', label: 'Pedidos de Venda', count: vendors.length },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leads & Contatos</h1>
          <p className={styles.subtitle}>Dados em tempo real do Firestore</p>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className={styles.tabCount}>{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <Loader size={24} className={styles.spin} />
          <span>Carregando do Firestore...</span>
        </div>
      ) : (
        <>
          {tab === 'leads' && (
            <LeadsTable leads={leads} />
          )}
          {tab === 'contacts' && (
            <ContactsTable contacts={contacts} />
          )}
          {tab === 'vendors' && (
            <VendorsTable vendors={vendors} />
          )}
        </>
      )}
    </div>
  );
}

function LeadsTable({ leads }: { leads: FireLead[] }) {
  if (leads.length === 0) return <Empty text="Nenhum lead ainda. Os formulários de interesse aparecerão aqui." />;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>Contato</th><th>Equipamento</th><th>Status</th><th>Data</th></tr>
        </thead>
        <tbody>
          {leads.map(l => (
            <tr key={l.id}>
              <td>
                <div className={styles.contactCell}>
                  <span className={styles.contactName}>{l.name}</span>
                  <a href={`mailto:${l.email}`} className={styles.contactSub}>{l.email}</a>
                  <a href={`tel:${l.phone}`} className={styles.contactSub}>{l.phone}</a>
                  {l.message && <p className={styles.message}>{l.message}</p>}
                </div>
              </td>
              <td className={styles.muted}>{l.listing_title ?? '—'}</td>
              <td>
                <span className={`${styles.status} ${statusClass[l.status ?? 'new']}`}>
                  {statusLabel[l.status ?? 'new']}
                </span>
              </td>
              <td className={styles.date}>{fmt(l.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactsTable({ contacts }: { contacts: FireContact[] }) {
  if (contacts.length === 0) return <Empty text="Nenhuma mensagem de contato ainda." />;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>Contato</th><th>Assunto</th><th>Mensagem</th><th>Data</th></tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td>
                <div className={styles.contactCell}>
                  <span className={styles.contactName}>{c.name}</span>
                  <a href={`mailto:${c.email}`} className={styles.contactSub}>{c.email}</a>
                  {c.phone && <a href={`tel:${c.phone}`} className={styles.contactSub}>{c.phone}</a>}
                </div>
              </td>
              <td className={styles.muted}>{c.subject}</td>
              <td><p className={styles.message}>{c.message}</p></td>
              <td className={styles.date}>{fmt(c.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VendorsTable({ vendors }: { vendors: FireVendor[] }) {
  if (vendors.length === 0) return <Empty text="Nenhum pedido de venda ainda." />;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr><th>Vendedor</th><th>Equipamento</th><th>Local</th><th>Preço</th><th>Status</th><th>Data</th></tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v.id}>
              <td>
                <div className={styles.contactCell}>
                  <span className={styles.contactName}>{v.name}</span>
                  <a href={`mailto:${v.email}`} className={styles.contactSub}>{v.email}</a>
                  <a href={`tel:${v.phone}`} className={styles.contactSub}>{v.phone}</a>
                </div>
              </td>
              <td>
                <div className={styles.contactCell}>
                  <span className={styles.contactName}>{v.equipment_title}</span>
                  <span className={styles.contactSub}>{v.category} · {v.condition}</span>
                  {v.brand && <span className={styles.contactSub}>{v.brand} {v.model}</span>}
                </div>
              </td>
              <td className={styles.muted}>{v.city}, {v.state}</td>
              <td className={styles.price}>{v.price ? `R$ ${Number(v.price).toLocaleString('pt-BR')}` : '—'}</td>
              <td>
                <span className={`${styles.status} ${statusClass[v.status ?? 'pending']}`}>
                  {statusLabel[v.status ?? 'pending']}
                </span>
              </td>
              <td className={styles.date}>{fmt(v.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>{text}</p>
    </div>
  );
}
