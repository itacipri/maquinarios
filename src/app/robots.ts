import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/login', '/admin/equipamentos', '/admin/leads'],
      },
    ],
    sitemap: 'https://maquinarios.com.br/sitemap.xml',
  };
}
