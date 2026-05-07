'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Loader2 } from 'lucide-react';
import { seedListings } from '@/lib/listings';

export default function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    if (!confirm('Popular Firestore com dados de exemplo? Equipamentos existentes serão mantidos.')) return;
    setLoading(true);
    try {
      await seedListings();
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Erro ao popular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-ghost btn-sm" onClick={handleSeed} disabled={loading} title="Popular com dados de exemplo">
      {loading ? <Loader2 size={14} className="spinner-icon" /> : <Database size={14} />}
      {loading ? 'Populando...' : 'Seed'}
    </button>
  );
}
