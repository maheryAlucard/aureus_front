import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export const useSEO = (data: SEOData) => {
  useEffect(() => {
    const {
      title = "Aureus | La Rencontre de la Créativité & de l'Intelligence",
      description = "Agence digitale premium spécialisée en développement web/app, production vidéo et branding. Tech, Studio & Brand - Une approche unique pour transformer votre présence digitale.",
      image = "https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6",
      url = typeof window !== 'undefined' ? window.location.href : 'https://aureus.agency',
      type = 'website',
      author,
      publishedTime,
      modifiedTime,
      tags = []
    } = data;

    const fullTitle = title.includes('Aureus') ? title : `${title} | Aureus`;
    const siteName = 'Agence Digitale Aureus';

    // Update title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', tags.length > 0 ? tags.join(', ') : 'agence digitale, développement web, production vidéo, branding, marketing digital, automatisation, IA, VFX, 3D, community management');
    if (author) setMetaTag('author', author);

    // Open Graph
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', siteName, true);
    setMetaTag('og:locale', 'fr_FR', true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', url);
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Article specific
    if (type === 'article') {
      if (author) setMetaTag('article:author', author, true);
      if (publishedTime) setMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) setMetaTag('article:modified_time', modifiedTime, true);
      tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Structured Data
    const removeExistingStructuredData = () => {
      const existing = document.querySelectorAll('script[type="application/ld+json"]');
      existing.forEach(el => el.remove());
    };

    removeExistingStructuredData();

    // Organization structured data
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: 'https://aureus.agency',
      logo: image,
      description: description,
      sameAs: [
        'https://twitter.com/aureus',
        'https://linkedin.com/company/aureus',
        'https://github.com/aureus'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'contact@aureus.agency'
      }
    };

    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.textContent = JSON.stringify(organizationData);
    document.head.appendChild(orgScript);

    // Article structured data
    if (type === 'article') {
      const articleData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: fullTitle,
        description: description,
        image: image,
        author: {
          '@type': 'Organization',
          name: author || siteName
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: image
          }
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        }
      };

      const articleScript = document.createElement('script');
      articleScript.type = 'application/ld+json';
      articleScript.textContent = JSON.stringify(articleData);
      document.head.appendChild(articleScript);
    }

    // Service structured data
    const serviceData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Digital Agency Services',
      provider: {
        '@type': 'Organization',
        name: siteName
      },
      areaServed: 'FR',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Développement Web & Application',
              description: 'Développement web/app, automatisation & IA, consulting tech'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Production Vidéo & VFX',
              description: 'Vidéo, 3D, VFX, production et post-production'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Branding & Growth Marketing',
              description: 'Branding, identité visuelle, growth & social media'
            }
          }
        ]
      }
    };

    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.textContent = JSON.stringify(serviceData);
    document.head.appendChild(serviceScript);
  }, [data]);
};

