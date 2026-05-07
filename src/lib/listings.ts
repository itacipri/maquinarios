import {
  collection, addDoc, updateDoc, deleteDoc,
  getDocs, doc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore/lite';
import { db } from './firebase';
import { Listing, ListingFilters } from '@/types';
import { mockListings, mockCategories } from '@/data/mock';

// ─── Slug ────────────────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Filter helper ────────────────────────────────────────────────────────────
function applyFilters(listings: Listing[], filters?: ListingFilters): Listing[] {
  if (!filters) return listings;
  let r = [...listings];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    r = r.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.brand?.toLowerCase().includes(q) ||
      l.model?.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters.category) {
    const cat = mockCategories.find(c => c.slug === filters.category);
    if (cat) r = r.filter(l => l.category === cat.name);
  }
  if (filters.state)      r = r.filter(l => l.location_state === filters.state);
  if (filters.condition)  r = r.filter(l => l.condition === filters.condition);
  if (filters.price_min !== undefined) r = r.filter(l => (l.price ?? 0) >= filters.price_min!);
  if (filters.price_max !== undefined) r = r.filter(l => (l.price ?? Infinity) <= filters.price_max!);
  if (filters.featured)   r = r.filter(l => l.featured);

  return r;
}

// ─── Public reads ─────────────────────────────────────────────────────────────
export async function getActiveListings(filters?: ListingFilters): Promise<Listing[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'listings'), where('status', '==', 'active'), orderBy('created_at', 'desc'))
    );
    const source = snap.empty
      ? mockListings.filter(l => l.status === 'active')
      : snap.docs.map(d => ({ ...d.data(), id: d.id } as Listing));
    return applyFilters(source, filters);
  } catch {
    return applyFilters(mockListings.filter(l => l.status === 'active'), filters);
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  try {
    const snap = await getDocs(
      query(collection(db, 'listings'), where('slug', '==', slug))
    );
    if (!snap.empty) return { ...snap.docs[0].data(), id: snap.docs[0].id } as Listing;
    return mockListings.find(l => l.slug === slug) ?? null;
  } catch {
    return mockListings.find(l => l.slug === slug) ?? null;
  }
}

export async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'listings'), where('status', '==', 'active'), where('featured', '==', true), orderBy('created_at', 'desc'))
    );
    if (!snap.empty) return snap.docs.map(d => ({ ...d.data(), id: d.id } as Listing));
    return mockListings.filter(l => l.featured && l.status === 'active');
  } catch {
    return mockListings.filter(l => l.featured && l.status === 'active');
  }
}

// ─── Admin reads ──────────────────────────────────────────────────────────────
export async function getAllListingsAdmin(): Promise<Listing[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'listings'), orderBy('created_at', 'desc'))
    );
    if (!snap.empty) return snap.docs.map(d => ({ ...d.data(), id: d.id } as Listing));
    return mockListings;
  } catch {
    return mockListings;
  }
}

// ─── Admin writes ─────────────────────────────────────────────────────────────
export async function createListing(data: Omit<Listing, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'listings'), {
    ...data,
    views: 0,
    leads_count: 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return ref.id;
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  await updateDoc(doc(db, 'listings', id), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

export async function deleteListing(id: string): Promise<void> {
  await deleteDoc(doc(db, 'listings', id));
}

export async function seedListings(): Promise<void> {
  for (const listing of mockListings) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = listing;
    await addDoc(collection(db, 'listings'), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  }
}
