'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader } from 'lucide-react';
import { saveLead } from '@/lib/firestore';
import styles from './InterestForm.module.css';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  listingId: string;
  listingTitle: string;
}

export default function InterestForm({ listingId, listingTitle }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await saveLead({ listing_id: listingId, listing_title: listingTitle, ...data });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle size={36} className={styles.successIcon} />
        <h3 className={styles.successTitle}>Mensagem enviada!</h3>
        <p className={styles.successText}>
          Nossa equipe entrará em contato com você em até 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <h3 className={styles.formTitle}>Tenho Interesse</h3>
      <p className={styles.formSubtitle}>
        Preencha seus dados e entraremos em contato sobre<br />
        <strong>{listingTitle}</strong>
      </p>

      <div className={styles.field}>
        <label className="label" htmlFor="interest-name">Nome *</label>
        <input
          id="interest-name"
          className="input"
          type="text"
          placeholder="Seu nome completo"
          {...register('name')}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className="label" htmlFor="interest-phone">Telefone / WhatsApp *</label>
        <input
          id="interest-phone"
          className="input"
          type="tel"
          placeholder="(11) 99999-9999"
          {...register('phone')}
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label className="label" htmlFor="interest-email">E-mail *</label>
        <input
          id="interest-email"
          className="input"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className="label" htmlFor="interest-message">Mensagem (opcional)</label>
        <textarea
          id="interest-message"
          className={`input ${styles.textarea}`}
          placeholder="Dúvidas, forma de pagamento, condições..."
          rows={3}
          {...register('message')}
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary btn-lg ${styles.submitBtn}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? <><Loader size={16} className={styles.spin} /> Enviando...</> : 'Enviar Interesse'}
      </button>

      <p className={styles.privacy}>
        Seus dados são usados apenas para intermediação e nunca compartilhados.
      </p>
    </form>
  );
}
