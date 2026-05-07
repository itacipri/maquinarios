'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { saveContact } from '@/lib/firestore';
import styles from './page.module.css';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(4, 'Assunto obrigatório'),
  message: z.string().min(10, 'Mensagem obrigatória'),
});

type FormData = z.infer<typeof schema>;

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await saveContact(data);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Fale Conosco</h1>
          <p className={styles.pageSubtitle}>
            Tire dúvidas, faça parcerias ou solicite suporte. Respondemos em até 24 horas.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Form */}
          <div>
            {submitted ? (
              <div className={styles.success}>
                <CheckCircle size={40} className={styles.successIcon} />
                <h2 className={styles.successTitle}>Mensagem enviada!</h2>
                <p className={styles.successText}>
                  Recebemos seu contato e retornaremos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className="label" htmlFor="c-name">Nome *</label>
                    <input id="c-name" className="input" type="text" placeholder="Seu nome" {...register('name')} />
                    {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className="label" htmlFor="c-email">E-mail *</label>
                    <input id="c-email" className="input" type="email" placeholder="seu@email.com" {...register('email')} />
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className="label" htmlFor="c-phone">Telefone</label>
                    <input id="c-phone" className="input" type="tel" placeholder="(11) 99999-9999" {...register('phone')} />
                  </div>
                  <div className={styles.field}>
                    <label className="label" htmlFor="c-subject">Assunto *</label>
                    <input id="c-subject" className="input" type="text" placeholder="Como podemos ajudar?" {...register('subject')} />
                    {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className="label" htmlFor="c-message">Mensagem *</label>
                  <textarea
                    id="c-message"
                    className={`input ${styles.textarea}`}
                    rows={5}
                    placeholder="Descreva sua dúvida ou solicitação..."
                    {...register('message')}
                  />
                  {errors.message && <span className={styles.error}>{errors.message.message}</span>}
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? <><Loader size={16} className={styles.spin} /> Enviando...</>
                    : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <aside className={styles.sidebar}>
            <div className={`card ${styles.infoCard}`}>
              <h3 className={styles.infoTitle}>Informações de Contato</h3>

              <div className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Telefone / WhatsApp</p>
                  <a href="tel:+5511999999999" className={styles.contactValue}>(11) 99999-9999</a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>E-mail</p>
                  <a href="mailto:contato@maquinarios.com.br" className={styles.contactValue}>
                    contato@maquinarios.com.br
                  </a>
                </div>
              </div>

              <div className={styles.contactItem}>
                <MapPin size={16} className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Localização</p>
                  <p className={styles.contactValue}>São Paulo, SP — Brasil</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Clock size={16} className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Atendimento</p>
                  <p className={styles.contactValue}>Seg a Sex, 9h – 18h</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-secondary ${styles.whatsappBtn}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Fale pelo WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
