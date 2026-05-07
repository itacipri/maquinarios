import { ShieldCheck, Users, Headphones, BadgeDollarSign, FileCheck, Zap } from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const items = [
  {
    icon: <ShieldCheck size={26} />,
    title: 'Intermediação Segura',
    description: 'Todas as negociações passam pela nossa equipe. Verificamos vendedor, equipamento e documentação antes de fechar.',
  },
  {
    icon: <Users size={26} />,
    title: 'Equipe Especializada',
    description: 'Consultores com experiência no setor industrial para te ajudar a escolher o equipamento certo para sua operação.',
  },
  {
    icon: <Headphones size={26} />,
    title: 'Suporte Completo',
    description: 'Atendimento via WhatsApp, telefone e e-mail. Acompanhamos seu processo do primeiro contato até a entrega.',
  },
  {
    icon: <BadgeDollarSign size={26} />,
    title: 'Melhores Preços',
    description: 'Acesso direto a vendedores em todo o Brasil. Sem intermediários desnecessários — só você, o vendedor e nós.',
  },
  {
    icon: <FileCheck size={26} />,
    title: 'Documentação Garantida',
    description: 'Cuidamos de toda a burocracia: notas fiscais, transferência de propriedade e contratos de forma segura.',
  },
  {
    icon: <Zap size={26} />,
    title: 'Negociação Ágil',
    description: 'Processo simplificado para fechar negócio rápido. Do interesse ao fechamento em poucos dias.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="section-title">Por Que Escolher o Maquinários?</h2>
          <p className="section-subtitle">
            Somos especialistas em conectar compradores e vendedores de equipamentos industriais com segurança e agilidade.
          </p>
        </div>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <div key={i} className={`card ${styles.card}`}>
              <div className={styles.iconWrap} aria-hidden="true">
                {item.icon}
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
