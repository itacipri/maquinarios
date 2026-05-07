'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createListing, updateListing, slugify } from '@/lib/listings';
import { mockCategories } from '@/data/mock';
import ImageUpload from './ImageUpload';
import type { Listing, EquipmentCondition, ListingStatus } from '@/types';
import styles from './ListingForm.module.css';

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

type FormData = Omit<Listing, 'id' | 'slug' | 'views' | 'leads_count' | 'created_at' | 'updated_at' | 'created_by'>;

function defaultForm(): FormData {
  return {
    title: '', description: '', category: '', subcategory: '',
    condition: 'used', year: undefined, brand: '', model: '',
    specs: {}, location_state: 'SP', location_city: '',
    price: undefined, price_negotiable: false, price_display: '',
    images: [], thumbnail: '',
    status: 'active', featured: false, tags: [],
  };
}

interface Props {
  listing?: Listing;
}

export default function ListingForm({ listing }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(listing ? {
    title: listing.title, description: listing.description,
    category: listing.category, subcategory: listing.subcategory,
    condition: listing.condition, year: listing.year,
    brand: listing.brand ?? '', model: listing.model ?? '',
    specs: listing.specs, location_state: listing.location_state,
    location_city: listing.location_city, price: listing.price,
    price_negotiable: listing.price_negotiable, price_display: listing.price_display,
    images: listing.images, thumbnail: listing.thumbnail,
    status: listing.status, featured: listing.featured,
    tags: listing.tags,
  } : defaultForm());

  const [tagsInput, setTagsInput] = useState(listing?.tags.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!listing;

  const selectedCategory = mockCategories.find(c => c.name === form.category);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleImages(urls: string[]) {
    set('images', urls);
    set('thumbnail', urls[0] ?? '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Título é obrigatório.'); return; }
    if (!form.category) { setError('Categoria é obrigatória.'); return; }
    if (!form.description.trim()) { setError('Descrição é obrigatória.'); return; }
    if (!form.location_city.trim()) { setError('Cidade é obrigatória.'); return; }

    setSaving(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const now = new Date().toISOString();
      const slug = slugify(form.title);

      const priceDisplay = form.price
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.price)
        : form.price_negotiable ? 'A negociar' : 'Consultar';

      const data = { ...form, tags, slug, price_display: priceDisplay };

      if (isEdit && listing) {
        await updateListing(listing.id, { ...data, updated_at: now });
      } else {
        await createListing({ ...data, views: 0, leads_count: 0, created_at: now, updated_at: now, created_by: 'admin' });
      }

      router.push('/admin/equipamentos');
      router.refresh();
    } catch (e) {
      console.error(e);
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Imagens */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Imagens</h2>
        <ImageUpload value={form.images} onChange={handleImages} />
      </section>

      {/* Informações Básicas */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Informações Básicas</h2>
        <div className={styles.grid2}>
          <div className={`${styles.field} ${styles.spanFull}`}>
            <label className={styles.label}>Título *</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Ex: Torno CNC Romi Galaxy 15"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Categoria *</label>
            <select
              className={styles.select}
              value={form.category}
              onChange={e => { set('category', e.target.value); set('subcategory', ''); }}
              required
            >
              <option value="">Selecione...</option>
              {mockCategories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Subcategoria</label>
            <select
              className={styles.select}
              value={form.subcategory}
              onChange={e => set('subcategory', e.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">Selecione...</option>
              {selectedCategory?.subcategories.map(s => (
                <option key={s.slug} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Condição *</label>
            <select
              className={styles.select}
              value={form.condition}
              onChange={e => set('condition', e.target.value as EquipmentCondition)}
            >
              <option value="used">Usado</option>
              <option value="new">Novo</option>
              <option value="reconditioned">Recondicionado</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ano</label>
            <input
              className={styles.input}
              type="number"
              min={1950}
              max={new Date().getFullYear()}
              value={form.year ?? ''}
              onChange={e => set('year', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 2019"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Marca</label>
            <input
              className={styles.input}
              value={form.brand ?? ''}
              onChange={e => set('brand', e.target.value)}
              placeholder="Ex: Romi, Schuler"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Modelo</label>
            <input
              className={styles.input}
              value={form.model ?? ''}
              onChange={e => set('model', e.target.value)}
              placeholder="Ex: Galaxy 15"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Descrição *</label>
          <textarea
            className={styles.textarea}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            placeholder="Descreva o equipamento em detalhes..."
            required
          />
        </div>
      </section>

      {/* Localização */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Localização</h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Estado *</label>
            <select
              className={styles.select}
              value={form.location_state}
              onChange={e => set('location_state', e.target.value)}
            >
              {BR_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cidade *</label>
            <input
              className={styles.input}
              value={form.location_city}
              onChange={e => set('location_city', e.target.value)}
              placeholder="Ex: São Paulo"
              required
            />
          </div>
        </div>
      </section>

      {/* Preço */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preço</h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Valor (R$)</label>
            <input
              className={styles.input}
              type="number"
              min={0}
              step={0.01}
              value={form.price ?? ''}
              onChange={e => set('price', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 45000"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>&nbsp;</label>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.price_negotiable}
                onChange={e => set('price_negotiable', e.target.checked)}
              />
              Preço negociável
            </label>
          </div>
        </div>
      </section>

      {/* Publicação */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Publicação</h2>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={form.status}
              onChange={e => set('status', e.target.value as ListingStatus)}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="sold">Vendido</option>
              <option value="reserved">Reservado</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>&nbsp;</label>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
              />
              Destacar na home
            </label>
          </div>

          <div className={`${styles.field} ${styles.spanFull}`}>
            <label className={styles.label}>Tags (separadas por vírgula)</label>
            <input
              className={styles.input}
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Ex: cnc, torno, automático"
            />
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <><Loader2 size={16} className={styles.spinner} /> Salvando...</> : isEdit ? 'Salvar Alterações' : 'Criar Anúncio'}
        </button>
      </div>
    </form>
  );
}
