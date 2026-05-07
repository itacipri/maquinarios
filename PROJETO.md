# Maquinários — Portal de Máquinas e Equipamentos Industriais

**Stack:** Next.js 16.2.5 · React 19 · TypeScript · Firebase · CSS Modules · Lucide React

---

## Visão Geral

Portal B2B brasileiro para compra e venda de máquinas e equipamentos industriais. Design dark com acentos em laranja/âmbar. Intermediação via WhatsApp.

---

## Stack e Dependências

| Pacote | Versão | Uso |
|---|---|---|
| next | 16.2.5 | Framework |
| react / react-dom | 19.2.4 | UI |
| firebase | ^12.12.1 | Backend / Storage |
| react-hook-form | ^7.75.0 | Formulários |
| @hookform/resolvers | ^5.2.2 | Validação de forms |
| zod | ^4.4.3 | Schema validation |
| lucide-react | ^1.14.0 | Ícones |

---

## Estrutura de Arquivos

```
maquinarios-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout: Header + Footer + WhatsAppFloat
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Design tokens + utilitários globais
│   │   ├── page.module.css
│   │   ├── favicon.ico
│   │   ├── admin/
│   │   │   ├── login/               # [SEM PAGE] Admin login
│   │   │   ├── equipamentos/        # [SEM PAGE] Gerenciar equipamentos
│   │   │   └── leads/               # [SEM PAGE] Gerenciar leads
│   │   ├── categorias/              # [SEM PAGE] Listagem de categorias
│   │   ├── contato/                 # [SEM PAGE] Formulário de contato
│   │   ├── equipamentos/            # [SEM PAGE] Catálogo
│   │   ├── sobre/                   # [SEM PAGE] Sobre o portal
│   │   └── vendedor/                # [SEM PAGE] Formulário para vender
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx      # 'use client' · busca + estados BR
│   │   │   ├── HeroSection.module.css
│   │   │   ├── StatsBar.tsx         # 4 métricas fixas
│   │   │   ├── StatsBar.module.css
│   │   │   ├── CategoryGrid.tsx     # Grid das 8 categorias
│   │   │   ├── CategoryGrid.module.css
│   │   │   ├── FeaturedListings.tsx # Equipamentos em destaque
│   │   │   ├── FeaturedListings.module.css
│   │   │   ├── HowItWorks.tsx       # 4 passos do processo
│   │   │   ├── HowItWorks.module.css
│   │   │   ├── LatestListings.tsx   # Últimos cadastrados
│   │   │   └── LatestListings.module.css
│   │   ├── layout/
│   │   │   ├── Header.tsx           # 'use client' · sticky · mobile menu
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx           # Links + contato + redes sociais
│   │   │   ├── Footer.module.css
│   │   │   ├── WhatsAppFloat.tsx    # Botão fixo bottom-right
│   │   │   └── WhatsAppFloat.module.css
│   │   ├── listing/
│   │   │   ├── ListingCard.tsx      # Card de equipamento
│   │   │   └── ListingCard.module.css
│   │   ├── admin/                   # [VAZIO]
│   │   └── ui/                      # [VAZIO]
│   ├── data/
│   │   └── mock.ts                  # 8 categorias + 6 listings de exemplo
│   ├── lib/
│   │   └── firebase.ts             # Init app, export db / auth / storage
│   └── types/
│       └── index.ts                 # Todos os tipos do domínio
├── .env.local.example               # Template das variáveis Firebase
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## Tipos de Domínio (`src/types/index.ts`)

```typescript
EquipmentCondition   = 'new' | 'used' | 'reconditioned'
ListingStatus        = 'active' | 'sold' | 'reserved' | 'inactive'
LeadStatus           = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost'

Listing {
  id, title, slug, description
  category, subcategory
  condition: EquipmentCondition
  year, brand, model
  specs: EquipmentSpecs          // power, weight_kg, dimensions, voltage, rpm, capacity
  location_state, location_city
  price?, price_negotiable, price_display
  images[], thumbnail
  status: ListingStatus
  featured, views, leads_count, tags[]
  created_at, updated_at, created_by
}

Category {
  id, name, slug, icon, description
  listing_count, order
  subcategories: Subcategory[]   // { name, slug, specs_template? }
}

Lead {
  id, listing_id, listing_title
  name, phone, email, message?
  status: LeadStatus
  commission_value?, notes?
  source: 'site' | 'whatsapp' | 'phone'
  created_at, updated_at
}

ListingFilters {
  search?, category?, subcategory?
  condition?, state?
  price_min?, price_max?, featured?
}
```

---

## Dados Mock (`src/data/mock.ts`)

### Categorias (8)
| # | Nome | Ícone | Listings |
|---|---|---|---|
| 1 | Metalurgia e Usinagem | Cog | 48 |
| 2 | Construção Civil | HardHat | 35 |
| 3 | Madeira e Móveis | TreePine | 22 |
| 4 | Alimentos e Bebidas | UtensilsCrossed | 18 |
| 5 | Agrícola | Tractor | 31 |
| 6 | Energia e Elétrica | Zap | 29 |
| 7 | Têxtil | Shirt | 14 |
| 8 | Embalagem e Logística | Package | 20 |

### Listings de exemplo (6)
| Título | Estado | Destaque | Preço |
|---|---|---|---|
| Torno CNC Romi GL-240 | SP | Sim | R$ 185.000 |
| Fresadora Vertical Bridgeport Series I | MG | Sim | R$ 42.000 |
| Compressor de Ar Schulz 40 Pés | SC | Não | R$ 28.000 |
| Trator New Holland TM 7040 | PR | Sim | R$ 320.000 |
| Empilhadeira Elétrica Toyota 2.5T | SP | Não | R$ 95.000 |
| Gerador Diesel Stemac 150 kVA | RS | Sim | R$ 145.000 |

---

## Design System (`src/app/globals.css`)

**Tema:** Dark · Fontes: Oswald (headings) + Inter (body)

**Cores principais:**
- `--bg-primary`: fundo principal (#0c0f1a)
- `--accent-orange`: #f97316
- `--accent-amber`: #f59e0b
- `--accent-blue`: #3b82f6

**Classes utilitárias disponíveis:**
- Botões: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-lg`, `.btn-sm`
- Badges: `.badge`, `.badge-new`, `.badge-used`, `.badge-reconditioned`, `.badge-featured`, `.badge-sold`
- Layout: `.card`, `.section`, `.section-sm`, `.section-title`, `.section-subtitle`
- Forms: `.input`, `.label`
- Especiais: `.price-tag`, `.gradient-text`, `.whatsapp-float`
- Animações: `fadeIn`, `fadeInLeft`, `shimmer`

---

## Hierarquia de Componentes (Home)

```
RootLayout (layout.tsx)
├── Header          — sticky, mobile menu, busca desktop
├── main
│   ├── HeroSection        — busca principal + quick tags
│   ├── StatsBar           — 4 métricas
│   ├── CategoryGrid       — 8 categorias → /categorias/{slug}
│   ├── FeaturedListings   — listings com featured=true
│   │   └── ListingCard (×n)
│   ├── HowItWorks         — 4 passos
│   ├── LatestListings     — 6 últimos ativos
│   │   └── ListingCard (×n)
│   └── WhyChooseUs        — ⚠️ IMPORTADO MAS NÃO EXISTE AINDA
├── Footer
└── WhatsAppFloat
```

---

## Rotas (App Router)

| Rota | Status | Descrição |
|---|---|---|
| `/` | Implementada | Home |
| `/equipamentos` | Diretório criado, sem page | Catálogo com filtros |
| `/equipamentos/[slug]` | Diretório criado, sem page | Detalhe do equipamento |
| `/categorias` | Diretório criado, sem page | Todas as categorias |
| `/categorias/[slug]` | Diretório criado, sem page | Equipamentos por categoria |
| `/sobre` | Diretório criado, sem page | Sobre o portal |
| `/contato` | Diretório criado, sem page | Formulário de contato |
| `/vendedor` | Diretório criado, sem page | Cadastrar equipamento para venda |
| `/admin/login` | Diretório criado, sem page | Login administrativo |
| `/admin/equipamentos` | Diretório criado, sem page | CRUD de equipamentos |
| `/admin/leads` | Diretório criado, sem page | Gestão de leads |

---

## Firebase (`src/lib/firebase.ts`)

Singleton com `getApps().length === 0`. Exporta:
- `db` — Firestore
- `auth` — Firebase Auth
- `storage` — Firebase Storage

Variáveis em `.env.local` (ver `.env.local.example`).

---

## O que Falta Implementar

### Componentes
- [ ] `WhyChooseUs` — importado em `page.tsx`, ainda não existe
- [ ] Componentes de `/components/ui/` (botões, modals, inputs reutilizáveis)
- [ ] Componentes de `/components/admin/`

### Páginas
- [ ] `/equipamentos` — listagem com filtros (search, categoria, estado, condição, preço)
- [ ] `/equipamentos/[slug]` — detalhe: galeria, specs, formulário de interesse, listagens similares
- [ ] `/categorias` — grid de categorias
- [ ] `/categorias/[slug]` — listings filtrados por categoria
- [ ] `/sobre` — página institucional
- [ ] `/contato` — formulário com react-hook-form + zod
- [ ] `/vendedor` — formulário de cadastro de equipamento
- [ ] `/admin/login` — autenticação Firebase
- [ ] `/admin/equipamentos` — CRUD
- [ ] `/admin/leads` — visualização e gestão de leads

### Backend
- [ ] Migrar mock data para Firestore
- [ ] Funções de query (getListings, getListing, getCategories, createLead)
- [ ] Firebase Storage para imagens
- [ ] API Routes ou Server Actions para formulários
- [ ] Autenticação admin com Firebase Auth

### Outros
- [ ] SEO: sitemap.xml, robots.txt, metadados dinâmicos por página
- [ ] Loading states / skeletons
- [ ] Error boundaries
- [ ] Testes
