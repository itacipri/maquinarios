'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteListing } from '@/lib/listings';

interface Props {
  id: string;
  title: string;
}

export default function DeleteListingButton({ id, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return;
    setLoading(true);
    try {
      await deleteListing(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleDelete}
      disabled={loading}
      title="Excluir"
      style={{ color: 'var(--danger, #e53e3e)' }}
    >
      {loading ? <Loader2 size={14} className="spinner-icon" /> : <Trash2 size={14} />}
    </button>
  );
}
