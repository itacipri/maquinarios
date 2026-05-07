import Link from 'next/link';
import { ShieldCheck, Users, Handshake, BadgeCheck, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export const metadata = {
  title: 'Sobre | Maquinários',
  description: 'Conheça o portal Maquinários — intermediação especializada de máquinas e equipamentos industriais no Brasil.',
};

const values = [
  { icon: <ShieldCheck size={24} />, title: 'Segurança', desc: 'Todas as transações são intermediadas e verificadas pela nossa equipe.' },
  { icon: <Users size={24} />, title: 'Expertise', desc: 'Profissionais especializados no setor industrial com anos de experiência.' },
  { icon: <Handshake size={24} />, title: 'Confiança', desc: 'Compradores e vendedores protegidos em cada etapa da negociação.' },
  { icon: <BadgeCheck size={24} />, title: 'Qualidade', desc: 'Anúncios verificados e equipamentos avaliados antes da publicação.' },
];

const stats = [
  { value: '217', label: 'Equipamentos ativos' },
  { value: '89', label: 'Negociações realizadas' },
  { value: '24', label: 'Estados atendidos' },
  { value: '5+', label: 'Anos de experiência' },
];

export default function SobrePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            O Portal Especializado em<br />
            <span className="gradient-text">Máquinas Industriais</span>
          </h1>
          <p className={styles.heroText}>
            O Maquinários nasceu para simplificar a compra e venda de equipamentos industriais no Brasil.
            Conectamos compradores e vendedores com segurança, transparência e uma equipe especializada
            que cuida de cada detalhe da negociação.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mission */}
        <section className={styles.section}>
          <div className={styles.missionGrid}>
            <div>
              <h2 className={styles.sectionTitle}>Nossa Missão</h2>
              <p className={styles.text}>
                Facilitar o mercado secundário de máquinas e equipamentos industriais no Brasil,
                oferecendo uma plataforma confiável onde empresas e profissionais possam negociar
                com segurança e eficiência.
              </p>
              <p className={styles.text}>
                Sabemos que adquirir um equipamento industrial é uma decisão importante — envolve
                capital significativo, avaliação técnica e confiança no vendedor. É por isso que
                nossa equipe está presente em cada etapa, do primeiro contato até a entrega.
              </p>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.missionCard}>
                <span className={styles.missionYear}>2019</span>
                <p className={styles.missionCardText}>Fundação do portal com foco em equipamentos de metalurgia</p>
              </div>
              <div className={styles.missionCard}>
                <span className={styles.missionYear}>2021</span>
                <p className={styles.missionCardText}>Expansão para 8 categorias e cobertura nacional</p>
              </div>
              <div className={styles.missionCard}>
                <span className={styles.missionYear}>2024</span>
                <p className={styles.missionCardText}>Mais de 200 equipamentos intermediados com sucesso</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nossos Valores</h2>
          <div className={styles.valuesGrid}>
            {values.map(v => (
              <div key={v.title} className={`card ${styles.valueCard}`}>
                <div className={styles.valueIcon} aria-hidden="true">{v.icon}</div>
                <h3 className={styles.valueName}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Pronto para negociar?</h2>
          <p className={styles.ctaText}>
            Encontre o equipamento ideal ou cadastre o seu para vender com nossa intermediação.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/equipamentos" className="btn btn-primary btn-lg">
              Ver equipamentos <ArrowRight size={18} />
            </Link>
            <Link href="/vendedor" className="btn btn-secondary btn-lg">
              Quero vender
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
