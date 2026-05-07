'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader, Upload } from 'lucide-react';
import { saveVendorRequest } from '@/lib/firestore';
import styles from './page.module.css';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  equipment_title: z.string().min(4, 'Título obrigatório'),
  category: z.string().min(1, 'Selecione uma categoria'),
  condition: z.enum(['new', 'used', 'reconditioned'], { message: 'Selecione uma condição' }),
  year: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  price: z.string().optional(),
  state: z.string().min(1, 'Selecione o estado'),
  city: z.string().min(2, 'Cidade obrigatória'),
  description: z.string().min(20, 'Descreva o equipamento (mínimo 20 caracteres)'),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  'Metalurgia e Usinagem', 'Construção Civil', 'Madeira e Móveis',
  'Alimentos e Bebidas', 'Agrícola', 'Energia e Elétrica', 'Têxtil', 'Embalagem e Logística',
];

const STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function VendedorPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await saveVendorRequest(data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <CheckCircle size={52} className={styles.successIcon} />
          <h1 className={styles.successTitle}>Cadastro Recebido!</h1>
          <p className={styles.successText}>
            Recebemos as informações do seu equipamento. Nossa equipe analisará o cadastro
            e entrará em contato em até 24 horas para confirmar a publicação e acertar os detalhes.
          </p>
          <a href="/" className="btn btn-primary btn-lg">Voltar ao início</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Quero Vender Meu Equipamento</h1>
          <p className={styles.pageSubtitle}>
            Preencha o formulário abaixo. Nossa equipe cuida de todo o processo de venda para você.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Seus Dados</h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-name">Nome completo *</label>
                  <input id="v-name" className="input" type="text" placeholder="Seu nome" {...register('name')} />
                  {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-phone">Telefone / WhatsApp *</label>
                  <input id="v-phone" className="input" type="tel" placeholder="(11) 99999-9999" {...register('phone')} />
                  {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label className="label" htmlFor="v-email">E-mail *</label>
                <input id="v-email" className="input" type="email" placeholder="seu@email.com" {...register('email')} />
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dados do Equipamento</h2>
              <div className={styles.field}>
                <label className="label" htmlFor="v-title">Título do anúncio *</label>
                <input id="v-title" className="input" type="text" placeholder="Ex: Torno CNC Romi GL-240 2018" {...register('equipment_title')} />
                {errors.equipment_title && <span className={styles.error}>{errors.equipment_title.message}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-category">Categoria *</label>
                  <select id="v-category" className="input" {...register('category')}>
                    <option value="">Selecione...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className={styles.error}>{errors.category.message}</span>}
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-condition">Condição *</label>
                  <select id="v-condition" className="input" {...register('condition')}>
                    <option value="">Selecione...</option>
                    <option value="new">Novo</option>
                    <option value="used">Usado</option>
                    <option value="reconditioned">Recondicionado</option>
                  </select>
                  {errors.condition && <span className={styles.error}>{errors.condition.message}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-brand">Marca</label>
                  <input id="v-brand" className="input" type="text" placeholder="Ex: Romi, Schulz..." {...register('brand')} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-model">Modelo</label>
                  <input id="v-model" className="input" type="text" placeholder="Ex: GL-240" {...register('model')} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-year">Ano</label>
                  <input id="v-year" className="input" type="number" placeholder="Ex: 2019" min={1970} max={2025} {...register('year')} />
                </div>
              </div>

              <div className={styles.field}>
                <label className="label" htmlFor="v-price">Preço desejado (R$)</label>
                <input id="v-price" className="input" type="number" placeholder="Deixe em branco para a consultar" min={0} {...register('price')} />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Localização</h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-state">Estado *</label>
                  <select id="v-state" className="input" {...register('state')}>
                    <option value="">Selecione...</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className={styles.error}>{errors.state.message}</span>}
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="v-city">Cidade *</label>
                  <input id="v-city" className="input" type="text" placeholder="Sua cidade" {...register('city')} />
                  {errors.city && <span className={styles.error}>{errors.city.message}</span>}
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Descrição</h2>
              <div className={styles.field}>
                <label className="label" htmlFor="v-description">Descreva o equipamento *</label>
                <textarea
                  id="v-description"
                  className={`input ${styles.textarea}`}
                  placeholder="Estado de conservação, revisões realizadas, acessórios inclusos, motivo da venda..."
                  rows={5}
                  {...register('description')}
                />
                {errors.description && <span className={styles.error}>{errors.description.message}</span>}
              </div>

              <div className={styles.uploadHint}>
                <Upload size={18} aria-hidden="true" />
                <span>Fotos serão solicitadas por WhatsApp após o cadastro</span>
              </div>
            </section>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <><Loader size={16} className={styles.spin} /> Enviando...</>
                : 'Enviar Cadastro'}
            </button>
          </form>

          <aside className={styles.info}>
            <div className={`card ${styles.infoCard}`}>
              <h3 className={styles.infoTitle}>Como funciona?</h3>
              <ol className={styles.infoSteps}>
                <li>Você preenche o formulário com os dados do equipamento</li>
                <li>Nossa equipe analisa e entra em contato em até 24h</li>
                <li>Solicitamos fotos e validamos as informações</li>
                <li>Publicamos o anúncio no portal gratuitamente</li>
                <li>Intermediamos as negociações com compradores interessados</li>
                <li>Você recebe o valor acordado com segurança</li>
              </ol>
            </div>

            <div className={`card ${styles.infoCard}`}>
              <h3 className={styles.infoTitle}>Precisa de ajuda?</h3>
              <p className={styles.infoText}>Fale diretamente com nossa equipe pelo WhatsApp.</p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Quero vender um equipamento"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
