'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadListingImages, deleteImage } from '@/lib/storage';
import styles from './ImageUpload.module.css';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    const valid = arr.filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) return;

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const urls = await uploadListingImages(valid, pct => setProgress(Math.round(pct)));
      onChange([...value, ...urls]);
    } catch (e) {
      console.error(e);
      setError('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove(url: string) {
    try {
      await deleteImage(url);
    } catch {
      // ignore if already deleted
    }
    onChange(value.filter(u => u !== url));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={styles.wrapper}>
      {value.length > 0 && (
        <div className={styles.previews}>
          {value.map((url, i) => (
            <div key={url} className={`${styles.preview} ${i === 0 ? styles.main : ''}`}>
              <Image src={url} alt={`Imagem ${i + 1}`} fill className={styles.previewImg} sizes="160px" />
              {i === 0 && <span className={styles.mainBadge}>Principal</span>}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(url)}
                aria-label="Remover imagem"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`${styles.dropzone} ${uploading ? styles.uploading : ''}`}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Selecionar imagens"
      >
        {uploading ? (
          <div className={styles.progressWrapper}>
            <Loader2 size={24} className={styles.spinner} />
            <span className={styles.progressText}>Enviando... {progress}%</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <Upload size={24} className={styles.uploadIcon} />
            <span className={styles.dropText}>Arraste imagens aqui ou clique para selecionar</span>
            <span className={styles.dropHint}>PNG, JPG, WEBP até 5MB cada</span>
          </>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
