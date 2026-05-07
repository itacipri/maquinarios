# Apostila Completa — Projeto Maquinários

**Última atualização:** Maio 2026  
**Stack:** Next.js 16.2.5 · React 19 · TypeScript · Firebase · Cloudflare Workers  
**Status:** ✅ Em produção em `maquinarios.com.br`

---

## Índice

1. [Visão Geral & Stack](#visão-geral--stack)
2. [Arquitetura & Fluxo de Dados](#arquitetura--fluxo-de-dados)
3. [Estrutura Completa de Arquivos](#estrutura-completa-de-arquivos)
4. [Tipos de Dados (Domain Model)](#tipos-de-dados-domain-model)
5. [Firebase — Configuração & Segurança](#firebase--configuração--segurança)
6. [Páginas & Routes](#páginas--routes)
7. [Componentes](#componentes)
8. [Bibliotecas Principais](#bibliotecas-principais)
9. [Como Desenvolver Localmente](#como-desenvolver-localmente)
10. [Deploy & CI/CD](#deploy--cicd)
11. [Troubleshooting](#troubleshooting)

---

## Visão Geral & Stack

**O quê:** Portal B2B de compra/venda de máquinas industriais no Brasil.

**Quem usa:**
- **Visitantes:** Buscam equipamentos, preenchem formulário de interesse
- **Admin:** Cria/edita/deleta anúncios, faz upload de imagens, vê leads

**Tecnologias:**
| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 16 App Router, React 19, TypeScript |
| **Styling** | CSS Modules + variáveis CSS (design tokens) |
| **Ícones** | Lucide React v1 |
| **Forms** | React Hook Form + Zod validation |
| **Backend** | Serverless (Cloudflare Workers) |
| **Database** | Firestore (NoSQL) |
| **Storage** | Firebase Storage (imagens) |
| **Auth** | Firebase Auth (email/senha) |
| **Deploy** | Cloudflare Pages (git-based) |
| **DNS** | Cloudflare + Registro.br |

---

## Arquitetura & Fluxo de Dados

### Fluxo Público (Visitante)

```
[Visitante]
    ↓
[Next.js Server] — getDocs (Firestore Lite — REST/HTTP)
    ↓
[Firestore] — retorna listings ativos
    ↓
[Componentes React] — renderiza grid/detalhe
    ↓
[InterestForm] — salva lead em 'leads' collection
    ↓
[Firestore] — lead criado
```

### Fluxo Admin (Gerenciador)

```
[Admin] — acessa /admin/login
    ↓
[Firebase Auth] — signInWithEmailAndPassword
    ↓
[AdminGuard] — verifica onAuthStateChanged
    ↓
[/admin/equipamentos] — lê todos os docs de 'listings'
    ↓
[CRUD]
  ├─ CREATE: form → uploadImages → createListing
  ├─ READ: getAllListingsAdmin() → getDocs
  ├─ UPDATE: form → updateListing
  └─ DELETE: deleteListing + deleteImage
```

### Firestore Collections

```
firestore-project/
├── listings/              # Equipamentos (público, leitura + admin escrita)
│   ├── doc_id: {
│   │   ├── title, slug, description
│   │   ├── category, subcategory
│   │   ├── condition: 'used' | 'new' | 'reconditioned'
│   │   ├── images: ['url1', 'url2', ...]
│   │   ├── thumbnail: 'url'
│   │   ├── status: 'active' | 'sold' | 'inactive' | 'reserved'
│   │   ├── featured: boolean
│   │   ├── price, price_negotiable, price_display
│   │   ├── location_state, location_city
│   │   ├── specs: { power?, weight_kg?, rpm?, ... }
│   │   ├── views: number
│   │   ├── leads_count: number
│   │   ├── created_at: timestamp
│   │   ├── updated_at: timestamp
│   │   ├── created_by: string (userID)
│   │   └── tags: string[]
│   └── ... (mais docs)
│
├── leads/                 # Interessados em comprar (público, apenas escrita)
│   ├── doc_id: {
│   │   ├── listing_id: string
│   │   ├── listing_title: string
│   │   ├── name, phone, email, message?
│   │   ├── status: 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost'
│   │   ├── source: 'site' | 'whatsapp' | 'phone'
│   │   ├── created_at: timestamp
│   │   └── updated_at: timestamp
│   └── ... (mais docs)
│
├── contacts/              # Formulário de contato (público, apenas escrita)
│   ├── doc_id: {
│   │   ├── name, email, phone?, subject, message
│   │   ├── created_at: timestamp
│   │   └── source: 'site'
│   └── ... (mais docs)
│
└── vendedor_requests/     # Formulário de vendedores (público, apenas escrita)
    ├── doc_id: {
    │   ├── name, phone, email
    │   ├── equipment_title, category, condition, year?, brand?, model?
    │   ├── price?, state, city, description
    │   ├── status: 'pending' | 'approved' | 'rejected'
    │   └── created_at: timestamp
    └── ... (mais docs)
```

### Firebase Storage

```
gs://maquinarios-site.firebasestorage.app/
├── listings/
│   ├── {listing_id}/
│   │   ├── 0.jpg
│   │   ├── 1.jpg
│   │   └── ... (múltiplas imagens por anúncio)
│   └── ... (mais anúncios)
```

---

## Estrutura Completa de Arquivos

```
maquinarios-site/
│
├── public/
│   ├── favicon.ico
│   └── ... (estáticos públicos)
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout raiz: Header + children + Footer
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Design tokens + CSS global
│   │   ├── robots.ts                 # SEO: robots.txt
│   │   ├── sitemap.ts                # SEO: sitemap.xml (dinâmico)
│   │   ├── not-found.tsx             # 404 custom
│   │   ├── not-found.module.css
│   │   │
│   │   ├── admin/                    # Seção administrativa
│   │   │   ├── layout.tsx            # Admin layout com sidebar
│   │   │   ├── login/
│   │   │   │   ├── page.tsx          # Tela de login (email/senha)
│   │   │   │   └── page.module.css
│   │   │   ├── equipamentos/
│   │   │   │   ├── page.tsx          # [Server] Lista todos os equipamentos
│   │   │   │   ├── page.module.css   #   com summary cards + table + botões CRUD
│   │   │   │   ├── novo/
│   │   │   │   │   ├── page.tsx      # [Server] Criar novo equipamento
│   │   │   │   │   └── page.module.css
│   │   │   │   └── [id]/
│   │   │   │       └── editar/
│   │   │   │           └── page.tsx  # [Server] Editar equipamento existente
│   │   │   └── leads/
│   │   │       ├── page.tsx          # [Client] 3 tabs: Leads + Contatos + Vendedores
│   │   │       └── page.module.css   #   com tabelas e timestamps formatados
│   │   │
│   │   ├── categorias/
│   │   │   ├── page.tsx              # [Server] Lista todas as 8 categorias
│   │   │   ├── page.module.css
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # [Server] Detalhes de uma categoria + equipamentos
│   │   │       ├── page.module.css
│   │   │       ├── loading.tsx       # Skeleton enquanto carrega
│   │   │       └── loading.module.css
│   │   │
│   │   ├── equipamentos/
│   │   │   ├── page.tsx              # [Server] Catálogo com filtros + paginação
│   │   │   ├── page.module.css
│   │   │   ├── loading.tsx           # Skeleton
│   │   │   ├── loading.module.css
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # [Server] Detalhe do equipamento
│   │   │       ├── page.module.css
│   │   │       ├── loading.tsx       # Skeleton
│   │   │       └── loading.module.css
│   │   │
│   │   ├── contato/
│   │   │   ├── page.tsx              # [Client] Formulário de contato
│   │   │   └── page.module.css
│   │   │
│   │   ├── sobre/
│   │   │   ├── page.tsx              # [Server] About us estático
│   │   │   └── page.module.css
│   │   │
│   │   └── vendedor/
│   │       ├── page.tsx              # [Client] Formulário para vender
│   │       └── page.module.css
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── home/                     # Componentes da home
│   │   │   ├── HeroSection.tsx       # 'use client' · barra de busca principal
│   │   │   ├── HeroSection.module.css
│   │   │   ├── StatsBar.tsx          # 'use server' · 4 números estáticos
│   │   │   ├── StatsBar.module.css
│   │   │   ├── CategoryGrid.tsx      # 'use server' · grid 2x4 das categorias
│   │   │   ├── CategoryGrid.module.css
│   │   │   ├── FeaturedListings.tsx  # 'use server' · equipamentos em destaque
│   │   │   ├── FeaturedListings.module.css
│   │   │   ├── HowItWorks.tsx        # 'use server' · 4 passos (texto + ícones)
│   │   │   ├── HowItWorks.module.css
│   │   │   ├── LatestListings.tsx    # 'use server' · últimos cadastrados
│   │   │   ├── LatestListings.module.css
│   │   │   ├── WhyChooseUs.tsx       # 'use server' · 6 benefícios
│   │   │   └── WhyChooseUs.module.css
│   │   │
│   │   ├── layout/                   # Layout global
│   │   │   ├── Header.tsx            # 'use client' · sticky, mobile menu
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.tsx            # Links, email, redes sociais
│   │   │   ├── Footer.module.css
│   │   │   ├── WhatsAppFloat.tsx     # 'use client' · botão fixo WhatsApp
│   │   │   └── WhatsAppFloat.module.css
│   │   │
│   │   ├── listing/                  # Componentes de equipamentos
│   │   │   ├── ListingCard.tsx       # 'use client' · card para grid
│   │   │   ├── ListingCard.module.css
│   │   │   ├── FilterSidebar.tsx     # 'use client' · filtros (Suspense)
│   │   │   ├── FilterSidebar.module.css
│   │   │   ├── InterestForm.tsx      # 'use client' · form de interesse
│   │   │   ├── InterestForm.module.css
│   │   │   ├── Pagination.tsx        # 'use client' · paginação inteligente
│   │   │   └── Pagination.module.css
│   │   │
│   │   └── admin/                    # Componentes administrativos
│   │       ├── AdminGuard.tsx        # 'use client' · wrapper de auth
│   │       ├── AdminGuard.module.css
│   │       ├── ImageUpload.tsx       # 'use client' · drag & drop + Firebase Storage
│   │       ├── ImageUpload.module.css
│   │       ├── ListingForm.tsx       # 'use client' · formulário completo de equipamento
│   │       ├── ListingForm.module.css
│   │       ├── DeleteListingButton.tsx # 'use client' · com confirmação
│   │       └── SeedButton.tsx        # 'use client' · popula com dados de exemplo
│   │
│   ├── data/
│   │   └── mock.ts                   # 8 categorias + 6 equipamentos de exemplo
│   │
│   ├── lib/                          # Utilitários & helpers
│   │   ├── firebase.ts               # Init Firebase app, exports db/auth/storage
│   │   ├── firestore.ts              # Helpers: saveLead, saveContact, saveVendorRequest
│   │   ├── listings.ts               # CRUD completo: getActiveListings, createListing, etc.
│   │   └── storage.ts                # Upload de imagens para Firebase Storage
│   │
│   └── types/
│       └── index.ts                  # Tipos TypeScript do projeto
│
├── .env.local                        # ⚠️ NÃO COMMITAR — variáveis Firebase reais
├── .env.local.example                # Template público
├── .dev.vars                         # ⚠️ NÃO COMMITAR — env para Wrangler preview
├── .gitignore                        # Exclui env, build, node_modules
├── package.json                      # Dependencies + scripts
├── package-lock.json
├── next.config.ts                    # Next.js config: standalone + remotePatterns Firebase
├── tsconfig.json
├── eslint.config.mjs
├── wrangler.jsonc                    # Cloudflare Workers config: nodejs_compat
├── open-next.config.ts               # OpenNext config para Cloudflare
├── vercel.json                       # Config alternativo para Vercel (não usado)
├── Dockerfile                        # Multi-stage Docker build (alternativa local)
├── docker-compose.yml                # Compose config (alternativa local)
├── PROJETO.md                        # Resumo técnico
└── APOSTILA.md                       # Este arquivo 📖

```

---

## Tipos de Dados (Domain Model)

### `src/types/index.ts`

```typescript
// ─── Enums ───────────────────────────────────
export type EquipmentCondition = 'new' | 'used' | 'reconditioned';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'inactive';
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';

// ─── Specs de equipamento ───────────────────
export interface EquipmentSpecs {
  power?: string;           // Ex: "5 HP"
  weight_kg?: number;       // Peso em kg
  dimensions?: string;      // Ex: "2000x1500x800mm"
  voltage?: string;         // Ex: "220V trifásico"
  rpm?: number;             // Rotações por minuto
  capacity?: string;        // Capacidade (ex: "500L")
  [key: string]: string | number | undefined;  // Permite campos customizados
}

// ─── Listing (Equipamento) ──────────────────
export interface Listing {
  id: string;                          // Firebase doc ID
  title: string;                       // Ex: "Torno CNC Romi Galaxy 15"
  slug: string;                        // Para URL: torno-cnc-romi-galaxy-15
  description: string;                 // Descrição detalhada
  category: string;                    // Ex: "Metalurgia e Usinagem"
  subcategory: string;                 // Ex: "Tornos CNC"
  condition: EquipmentCondition;       // new | used | reconditioned
  year?: number;                       // Ano de fabricação
  brand?: string;                      // Marca
  model?: string;                      // Modelo
  specs: EquipmentSpecs;               // Especificações técnicas
  location_state: string;              // Ex: "SP"
  location_city: string;               // Ex: "São Paulo"
  price?: number;                      // Preço em reais
  price_negotiable: boolean;           // Preço pode ser negociado
  price_display: string;               // Ex: "R$ 45.000,00" ou "A negociar"
  images: string[];                    // URLs de todas as imagens
  thumbnail: string;                   // URL da primeira imagem
  status: ListingStatus;               // active | sold | inactive | reserved
  featured: boolean;                   // Destaque na home
  views: number;                       // Contador de visualizações
  leads_count: number;                 // Número de interessados
  tags: string[];                      // Ex: ["cnc", "torno", "automático"]
  created_at: string;                  // ISO string ou Timestamp Firebase
  updated_at: string;
  created_by: string;                  // ID do usuário que criou
}

// ─── Category ────────────────────────────────
export interface Category {
  id: string;                          // ID único
  name: string;                        // Ex: "Metalurgia e Usinagem"
  slug: string;                        // Ex: "metalurgia-usinagem"
  icon: string;                        // Nome do ícone Lucide
  description: string;                 // Descrição breve
  listing_count: number;               // Quantidade de anúncios
  order: number;                       // Ordem de exibição
  subcategories: Subcategory[];        // Array de subcategorias
}

export interface Subcategory {
  name: string;                        // Ex: "Tornos CNC"
  slug: string;                        // Ex: "tornos-cnc"
  specs_template?: string[];           // [Futuro] Template de specs
}

// ─── Lead (Interesse em Compra) ──────────────
export interface Lead {
  id: string;
  listing_id: string;                  // Qual equipamento interessou
  listing_title: string;               // Título do equipamento (cache)
  name: string;
  phone: string;                       // Com DDD
  email: string;
  message?: string;                    // Mensagem opcional
  status: LeadStatus;                  // new | contacted | negotiating | closed | lost
  commission_value?: number;           // Comissão de intermediação [Futuro]
  notes?: string;                      // Notas internas do admin
  source: 'site' | 'whatsapp' | 'phone';  // Como veio o lead
  created_at: string;                  // Timestamp
  updated_at: string;
}

// ─── Filtros ────────────────────────────────
export interface ListingFilters {
  search?: string;                     // Busca por texto
  category?: string;                   // Slug da categoria
  subcategory?: string;                // Slug da subcategoria
  condition?: EquipmentCondition;
  state?: string;                      // Ex: "SP"
  price_min?: number;
  price_max?: number;
  featured?: boolean;                  // Apenas destaques
}
```

---

## Firebase — Configuração & Segurança

### Credenciais (`.env.local`)

```bash
# Público (seguro commitar prefixo NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBB7XrHM2vubg4oGGZ3sN-dTvE_bpVAtl0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=maquinarios-site.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=maquinarios-site
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=maquinarios-site.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=267778747020
NEXT_PUBLIC_FIREBASE_APP_ID=1:267778747020:web:3e1a4eae700244dd18e9a9
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ─── LISTINGS: público lê, admin escreve ───────────────────
    match /listings/{doc=**} {
      allow read: if true;                          // Todos podem ler
      allow create, update, delete: if 
        request.auth != null &&                     // Deve estar autenticado
        request.auth.uid == resource.data.created_by;  // Pode editar só seu próprio
    }
    
    // ─── LEADS: público escreve, admin lê ────────────────────────
    match /leads/{doc=**} {
      allow create: if true;                        // Qualquer um pode criar lead
      allow read: if request.auth != null;          // Admin lê
      allow update, delete: if request.auth != null;
    }
    
    // ─── CONTACTS: público escreve, admin lê ─────────────────────
    match /contacts/{doc=**} {
      allow create: if true;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // ─── VENDEDOR_REQUESTS: público escreve, admin lê ────────────
    match /vendedor_requests/{doc=**} {
      allow create: if true;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Init Firebase (`src/lib/firebase.ts`)

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// ⚠️ firebase/firestore/lite = versão REST pura, sem eval() (necessário para Cloudflare)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = initializeFirestore(app, {});   // Firestore Lite
export const auth = getAuth(app);                 // Firebase Auth
export const storage = getStorage(app);           // Firebase Storage
```

**Por que `/lite`?**
- O SDK completo usa `gRPC` + `eval()`, que Cloudflare bloqueia
- O `/lite` usa HTTP REST + longPolling, funciona em Workers

---

## Páginas & Routes

### Públicas (SSR/SSG)

| Route | Arquivo | Tipo | Descrição |
|-------|---------|------|-----------|
| `/` | `app/page.tsx` | SSG | Home com hero + categorias + destaques + últimos |
| `/equipamentos` | `app/equipamentos/page.tsx` | SSR | Catálogo com filtros + paginação |
| `/equipamentos/[slug]` | `app/equipamentos/[slug]/page.tsx` | SSR | Detalhe do equipamento |
| `/categorias` | `app/categorias/page.tsx` | SSG | Lista todas as 8 categorias |
| `/categorias/[slug]` | `app/categorias/[slug]/page.tsx` | SSR | Equipamentos de uma categoria |
| `/sobre` | `app/sobre/page.tsx` | SSG | Sobre o portal |
| `/contato` | `app/contato/page.tsx` | SSR | Formulário de contato |
| `/vendedor` | `app/vendedor/page.tsx` | SSR | Formulário para vender |
| `/admin/login` | `app/admin/login/page.tsx` | SSR | Login (email/senha) |
| `/sitemap.xml` | `app/sitemap.ts` | Dinâmico | SEO: sitemap com todas as rotas |
| `/robots.txt` | `app/robots.ts` | Estático | SEO: bloqueia `/admin/*` |
| `/404` | `app/not-found.tsx` | Customizado | 404 com ícone + links |

### Administrativas (Protected)

| Route | Arquivo | Tipo | Descrição |
|-------|---------|------|-----------|
| `/admin/equipamentos` | `app/admin/equipamentos/page.tsx` | SSR | Lista todos os equipamentos + CRUD |
| `/admin/equipamentos/novo` | `app/admin/equipamentos/novo/page.tsx` | SSR | Criar novo equipamento |
| `/admin/equipamentos/[id]/editar` | `app/admin/equipamentos/[id]/editar/page.tsx` | SSR | Editar equipamento |
| `/admin/leads` | `app/admin/leads/page.tsx` | SSR | Gerenciar leads + contatos + vendedores |

**Proteção:**
- `AdminGuard.tsx` wrapper em `app/admin/layout.tsx`
- `onAuthStateChanged` (Firebase Auth) redireciona não-autenticados para `/admin/login`
- Storage das imagens no Firebase Storage (URLs públicas via Firestore)

---

## Componentes

### Home (`src/components/home/`)

#### `HeroSection.tsx` ('use client')
**O que faz:** Seção hero com busca principal.
- Input de busca + seletor de estado (27 estados BR)
- Ao submit: redireciona para `/equipamentos?busca=...&estado=...`
- Styling com gradiente + animação fade-in

**Props:** Nenhuma
**Estado local:** `search`, `state`

---

#### `StatsBar.tsx` (Server)
**O que faz:** 4 cards de métricas (fixos).
- Total de equipamentos: 48
- Empresas ativas: 12
- Cidades atendidas: 150
- Transações mensais: 320

**Props:** Nenhuma
**Dados:** Hardcoded

---

#### `CategoryGrid.tsx` (Server)
**O que faz:** Grid 2×4 das 8 categorias com ícone + nome + descrição.
**Props:**
```typescript
categories: Category[]  // De /data/mock.ts
```
**Comportamento:** Clique em categoria → `/equipamentos?categoria={slug}`

---

#### `FeaturedListings.tsx` (Server)
**O que faz:** Carrossel de 6 equipamentos em destaque.
**Props:**
```typescript
listings: Listing[]  // Filtrados com featured=true do getActiveListings()
```
**Componentes internos:** Múltiplos `<ListingCard/>`

---

#### `HowItWorks.tsx` (Server)
**O que faz:** 4 passos do processo (texto + ícones).
1. Busque equipamentos
2. Entre em contato
3. Negocie o melhor preço
4. Finalize a transação

---

#### `LatestListings.tsx` (Server)
**O que faz:** Grid de últimos 6 cadastrados.
**Props:**
```typescript
listings: Listing[]  // Sorted by created_at DESC
```

---

#### `WhyChooseUs.tsx` (Server)
**O que faz:** 6 benefícios (cards com ícones).
- Maior plataforma de máquinas
- Preços competitivos
- Vendedores verificados
- Suporte 24/7
- Frete facilitado
- Garantia de segurança

---

### Layout (`src/components/layout/`)

#### `Header.tsx` ('use client')
**O que faz:** Navbar sticky com logo + nav links + mobile menu.
**Estado:**
- `mobileMenuOpen`: boolean
- `isScrolled`: boolean (sticky effect)
**Comportamento:**
- Desktop: links horizontais
- Mobile: hamburger menu
- Links: Home, Equipamentos, Categorias, Sobre, Contato, /admin/login

---

#### `Footer.tsx` (Server)
**O que faz:** Footer com 4 colunas + email + redes sociais.
- Links principais
- Sobre a empresa
- Contato
- Legal (privacidade, termos)
- Email: contato@maquinarios.com.br
- Redes: Instagram, Facebook, LinkedIn (SVGs customizados)

---

#### `WhatsAppFloat.tsx` ('use client')
**O que faz:** Botão WhatsApp fixo bottom-right.
- Link para `https://wa.me/5511999999999`
- Pulse animation
- Icon: Lucide `MessageCircle`

---

### Listings (`src/components/listing/`)

#### `ListingCard.tsx` ('use client')
**O que faz:** Card de equipamento (thumbnail + title + category + price + location + views badge).
**Props:**
```typescript
listing: Listing
```
**Comportamento:** Clique → `/equipamentos/{slug}`
**Recursos especiais:**
- Category icon map (Cog, HardHat, TreePine, etc.)
- Badge "Destaque" se `featured=true`
- Badge "VENDIDO" se `status='sold'`
- Fallback icon: Wrench se sem imagem

---

#### `FilterSidebar.tsx` ('use client')
**O que faz:** Sidebar de filtros (Suspense fallback).
**Filtros:**
- Busca por texto
- Categoria (dropdown com categorias)
- Estado (dropdown com 27 estados)
- Condição (new/used/reconditioned)
- Preço mín/máx (range inputs)
- Checkbox: Apenas destaques
**Comportamento:** Ao selecionar → update URL searchParams → SSR refetch

---

#### `InterestForm.tsx` ('use client')
**O que faz:** Formulário de interesse em compra (name, phone, email, message).
**Props:**
```typescript
listingId: string
listingTitle: string
```
**Validação:** Zod schema
```typescript
name: string (min 3)
phone: string (11+ dígitos)
email: string (valid email)
message: string (optional)
```
**Submit:** Chama `saveLead()` → salva em Firestore `leads` collection
**UX:** Toast de sucesso + reset form

---

#### `Pagination.tsx` ('use client')
**O que faz:** Paginação inteligente (max 7 items com ellipsis).
**Props:**
```typescript
total: number      // Total de equipamentos
perPage: number    // 12 (PER_PAGE)
current: number    // Página atual
```
**Comportamento:**
- Prev/Next buttons (disabled se primeira/última página)
- Smart range: mostra páginas próximas + ellipsis
- Clique em página → atualiza URL `?pagina={n}`

---

### Admin (`src/components/admin/`)

#### `AdminGuard.tsx` ('use client')
**O que faz:** Wrapper de autenticação para rotas `/admin`.
**Comportamento:**
- `onAuthStateChanged` → verifica se autenticado
- Se não: redireciona para `/admin/login`
- Se sim: renderiza sidebar + main content
**Sidebar:** Nav para Equipamentos, Leads + logout button
**Mobile:** Hamburger menu similar ao Header

---

#### `ImageUpload.tsx` ('use client')
**O que faz:** Drag & drop + click upload de imagens para Firebase Storage.
**Props:**
```typescript
value: string[]          // URLs das imagens já uploaded
onChange: (urls: string[]) => void
```
**Recursos:**
- Drag & drop area
- Multiple file select
- Progress bar com percentual
- Preview de imagens com thumbnail
- Badge "Principal" na primeira imagem
- Botão remove (X) deleta do Storage

---

#### `ListingForm.tsx` ('use client')
**O que faz:** Formulário completo create/edit de equipamento.
**Props:**
```typescript
listing?: Listing  // Se editando, vem preenchido
```
**Campos:**
- Imagens (ImageUpload)
- Título, Categoria, Subcategoria, Condição, Ano, Marca, Modelo
- Descrição (textarea)
- Estado, Cidade
- Preço, Checkbox "negociável"
- Status (active/sold/inactive/reserved)
- Featured checkbox
- Tags (comma-separated)

**Validação:** Zod
**Submit:**
- Se criar: `createListing()` → salva em Firestore
- Se editar: `updateListing()` → atualiza doc
- Slug auto-gerado: `slugify(title)`
- Price display: formatado `new Intl.NumberFormat('pt-BR', ...)`
- Redirect: `/admin/equipamentos` com refresh

---

#### `DeleteListingButton.tsx` ('use client')
**O que faz:** Botão com confirm modal para deletar equipamento.
**Props:**
```typescript
id: string
title: string
```
**Comportamento:**
- Clique → `confirm("Excluir...")` dialog
- Se OK: `deleteListing(id)` + delete images
- Refresh page
- Spinner durante operação

---

#### `SeedButton.tsx` ('use client')
**O que faz:** Popula Firestore com dados de exemplo (`mockListings`).
**Props:** Nenhuma
**Comportamento:**
- Clique → `confirm("Popular com dados...")` dialog
- Se OK: `seedListings()` → adiciona 6 listings ao Firestore
- Spinner durante operação
- Refresh page

---

## Bibliotecas Principais

### Frontend

| Lib | Versão | Uso |
|-----|--------|-----|
| `next` | 16.2.5 | Framework SSR/SSG/ISR |
| `react` | 19.2.4 | UI framework |
| `typescript` | ^5 | Type safety |
| `lucide-react` | ^1.14.0 | 350+ ícones (Cog, Heart, etc.) |
| `react-hook-form` | ^7.75.0 | Form state management (zero re-renders) |
| `@hookform/resolvers` | ^5.2.2 | Integração zod com hook-form |
| `zod` | ^4.4.3 | Schema validation (parse/validate) |

### Backend/Database

| Lib | Versão | Uso |
|-----|--------|-----|
| `firebase` | ^12.12.1 | Client SDK |
| `firebase/firestore/lite` | (incluso) | Firestore REST client (sem gRPC) |
| `firebase/auth` | (incluso) | Auth client |
| `firebase/storage` | (incluso) | Storage client |

### Deploy

| Tool | Versão | Uso |
|------|--------|-----|
| `@opennextjs/cloudflare` | ^1.19.8 | Next.js adapter para Cloudflare Workers |
| `wrangler` | ^4.88.0 | Cloudflare CLI |

---

## Como Desenvolver Localmente

### Setup Inicial

```bash
# 1. Clone o repo
git clone https://github.com/itacipri/maquinarios.git
cd maquinarios-site

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais Firebase (você tem as reais)

# 4. Rodando localmente
npm run dev
# Acesse http://localhost:3000
```

### Scripts Disponíveis

```bash
npm run dev          # Next.js dev server com hot reload (porta 3000)
npm run build        # Build standalone Next.js para Docker
npm run start        # Inicia server Next.js (requer build)
npm run lint         # ESLint
npm run build:cf     # Build para Cloudflare (gera .open-next/)
npm run preview      # Preview local com wrangler (simula Cloudflare)
npm run deploy       # Deploy direto via Wrangler (requer `wrangler login`)
```

### Fluxo Desenvolvimento

**1. Feature nova:**
```bash
git checkout -b feat/nova-feature
# ... código ...
npm run dev  # teste localmente
git add . && git commit -m "feat: descrição"
git push origin feat/nova-feature
# Abra PR no GitHub
```

**2. Bug fix:**
```bash
git checkout -b fix/descricao-bug
# ... código ...
npm run dev  # teste
git add . && git commit -m "fix: descrição"
git push origin fix/descricao-bug
```

**3. Merge & Deploy:**
- Merge PR no GitHub `main`
- Cloudflare detecta automaticamente
- Build + deploy em ~2 minutos
- Site atualizado em `maquinarios.com.br`

### Testando Localmente

**Firestore real durante dev:**
- `.env.local` aponta para Firestore production
- Dados de dev vão direto pro banco real
- Melhor: use um projeto Firebase separado para dev

**Mock fallback:**
- Se Firestore cair, código automaticamente volta para `mockListings`
- Veja `src/lib/listings.ts`: todas as funções têm `try/catch`

**Testando auth:**
```bash
npm run dev
# Acesse http://localhost:3000/admin/login
# Use credenciais Firebase reais (seu email/senha)
# Auth funciona com Firebase Auth completo em dev
```

---

## Deploy & CI/CD

### Infraestrutura

```
        [GitHub]
            ↓
    [Cloudflare Pages]  ← Git integration
            ↓
    [Build: npm run build:cf]
            ↓
    [Upload: .open-next/ → Cloudflare]
            ↓
    [DNS: maquinarios.com.br via Registro.br]
            ↓
    [Live: https://maquinarios.com.br]
```

### Fluxo Deployment

1. **Local:**
   ```bash
   git push origin main
   ```

2. **GitHub (automaticamente):**
   - Detecta push em `main`
   - Dispara workflow (se houver, senão manual)

3. **Cloudflare Pages (automaticamente):**
   - Detecta novo commit
   - Clona repo
   - `npm install`
   - `npm run build:cf`
   - Faz upload de `.open-next/assets` + `.open-next/worker.js`
   - DNS aponta para `maquinarios.com.br`

4. **Verificação:**
   - Acesse `https://maquinarios.com.br`
   - Veja logs em Cloudflare Dashboard → Observability

### Environment Variables (Cloudflare)

No painel Cloudflare → Pages → maquinarios → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Todas as variáveis são `NEXT_PUBLIC_` (públicas no client, seguro pra frontend).

### Alternativas de Deploy

**Docker (se quiser rodar em VPS próprio):**
```bash
docker compose up --build -d
# Acessa http://localhost:3000 (porta 3000)
```

**Vercel (não está ativo, mas config existe):**
```bash
npm install -g vercel
vercel login
vercel deploy
```

---

## Troubleshooting

### 1. "Internal Server Error" no `/equipamentos`

**Causa:** Firebase SDK usando gRPC em Cloudflare.
**Solução:** Verificar se `src/lib/firebase.ts` usa `firebase/firestore/lite` (REST).
```typescript
import { initializeFirestore } from 'firebase/firestore/lite';  // ✅ Correto
// NÃO: import { getFirestore } from 'firebase/firestore';     // ❌ Errado
```

---

### 2. "Servidores de nomes inválidos" no Cloudflare

**Causa:** Nameservers do Cloudflare não foram salvos corretamente no Registro.br.
**Solução:**
1. Acesse Registro.br
2. Edite `maquinarios.com.br` → DNS
3. Confirme: `brett.ns.cloudflare.com` e `linda.ns.cloudflare.com`
4. Salve
5. Aguarde 1-2 horas para propagar

---

### 3. "Timeout ao fazer upload de imagem"

**Causa:** Imagem muito grande ou internet lenta.
**Solução:**
- Comprima imagens (máx 5MB recomendado)
- `src/components/admin/ImageUpload.tsx` tem limite de 5MB por arquivo

---

### 4. "Firebase Auth não funciona em localhost"

**Causa:** CORS ou domínio não autorizado no Firebase Console.
**Solução:**
1. Firebase Console → Authentication → Settings
2. Authorized domains: adicione `localhost:3000`
3. Reinicie `npm run dev`

---

### 5. "Dados não aparecem após Seed"

**Causa:** Firestore vazio, necessário clicar Seed.
**Solução:**
1. Acesse `/admin/login` (autenticado)
2. Vá em `/admin/equipamentos`
3. Clique botão **Seed**
4. Aguarde 30 segundos (adiciona 6 listings)
5. Recarregue a página

---

### 6. "Erro ao deletar imagem"

**Causa:** URL já foi deletada ou permissão negada.
**Solução:** Veja `src/lib/storage.ts` → função `deleteImage()` tem `try/catch`, ignora erros. Tudo bem se uma imagem falhar ao deletar, o listing é deletado mesmo.

---

### 7. "Build dá erro: 'eval() disallowed'"

**Causa:** Alguém importou do `firebase/firestore` em vez de `firebase/firestore/lite`.
**Solução:**
```bash
grep -r "from 'firebase/firestore'" src/
# Mude todos para 'firebase/firestore/lite'
```

---

### 8. "Imagens não carregam no site"

**Causa:** Firebase Storage URL não é pública ou CORS bloqueado.
**Solução:**
- Verificar `wrangler.jsonc` tem `nodejs_compat`
- Verificar `next.config.ts` tem `firebasestorage.googleapis.com` em `remotePatterns`
- Verificar Firebase Storage rules permitem `read` (padrão é privado)

**Firebase Storage Rules (permitir leitura pública):**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;           // Público
      allow write: if request.auth != null;  // Admin
    }
  }
}
```

---

## Roadmap & Ideias Futuras

- [ ] Integração com WhatsApp API (em vez de link)
- [ ] Sistema de avaliações (reviews)
- [ ] Comparador de preços
- [ ] Mapa geográfico (onde está cada equipamento)
- [ ] Wishlist/favoritos
- [ ] Histórico de visualizações
- [ ] Admin dashboard com gráficos (Analytics)
- [ ] Sistema de comissões para vendedores
- [ ] Email automático de confirmação de lead
- [ ] Integração com Mercado Livre / OLX
- [ ] PWA (offline support)
- [ ] Dark/Light mode toggle

---

## Referências & Links

**Documentação:**
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/database)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [OpenNext Cloudflare Adapter](https://opennext.js.org/cloudflare)
- [React 19 Docs](https://react.dev)

**Ferramentas:**
- [Lucide Icons](https://lucide.dev) — Ícones
- [Zod](https://zod.dev) — Validação
- [React Hook Form](https://react-hook-form.com) — Forms

**Repositório:**
- GitHub: https://github.com/itacipri/maquinarios
- Live: https://maquinarios.com.br

---

**Versão:** 1.0  
**Última atualização:** Maio 2026  
**Mantido por:** itacipri @ Maquinários
