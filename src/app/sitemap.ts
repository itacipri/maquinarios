import { MetadataRoute } from 'next';
import { mockListings, mockCategories } from '@/data/mock';

const BASE_URL = 'https://maquinarios.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/equipamentos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/categorias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/vendedor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const listingPages: MetadataRoute.Sitemap = mockListings
    .filter(l => l.status === 'active')
    .map(l => ({
      url: `${BASE_URL}/equipamentos/${l.slug}`,
      lastModified: new Date(l.updated_at),
      changeFrequency: 'weekly',
      priority: l.featured ? 0.85 : 0.7,
    }));

  const categoryPages: MetadataRoute.Sitemap = mockCategories.map(c => ({
    url: `${BASE_URL}/categorias/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticPages, ...listingPages, ...categoryPages];
}
