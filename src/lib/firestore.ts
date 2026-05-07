import { collection, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from './firebase';

export async function saveLead(data: {
  listing_id: string;
  listing_title: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
}) {
  return addDoc(collection(db, 'leads'), {
    ...data,
    status: 'new',
    source: 'site',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function saveContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return addDoc(collection(db, 'contacts'), {
    ...data,
    created_at: serverTimestamp(),
  });
}

export async function saveVendorRequest(data: {
  name: string;
  phone: string;
  email: string;
  equipment_title: string;
  category: string;
  condition: string;
  year?: string;
  brand?: string;
  model?: string;
  price?: string;
  state: string;
  city: string;
  description: string;
}) {
  return addDoc(collection(db, 'vendedor_requests'), {
    ...data,
    status: 'pending',
    created_at: serverTimestamp(),
  });
}
