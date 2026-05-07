import { Search, MessageCircle, Handshake, BadgeCheck } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: <Search size={28} />,
    number: '01',
    title: 'Encontre o Equipamento',
    description: 'Navegue pelo nosso catálogo com mais de 200 equipamentos. Use os filtros de categoria, estado, preço e condição para achar exatamente o que precisa.',
  },
  {
    icon: <MessageCircle size={28} />,
    number: '02',
    title: 'Demonstre Interesse',
    description: 'Achou algo interessante? Clique em "Tenho Interesse" ou fale direto pelo WhatsApp. Nossa equipe entra em contato em até 24 horas.',
  },
  {
    icon: <Handshake size={28} />,
    number: '03',
    title: 'Nós Intermediamos',
    description: 'Nossa equipe especializada negocia as condições com o vendedor, verifica o estado do equipamento e cuida de todos os detalhes da transação.',
  },
  {
    icon: <BadgeCheck size={28} />,
    number: '04',
    title: 'Compra Segura Realizada',
    description: 'Com a negociação fechada, você recebe o equipamento com garantia da intermediação. Pagamento seguro, documentação em ordem.',
  },
];

export default function HowItWorks() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title">Como Funciona</h2>
          <p className="section-subtitle">
            Simples, seguro e sem complicações. Nossa intermediação protege compradores e vendedores.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.iconWrap} aria-hidden="true">{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {i < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
