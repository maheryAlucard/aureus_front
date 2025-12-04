import React from 'react';

interface SEOProps {
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

export const SEO: React.FC<SEOProps> = ({
  title = "Aureus | La Rencontre de la Créativité & de l'Intelligence",
  description = "Agence digitale premium spécialisée en développement web/app, production vidéo et branding. Tech, Studio & Brand - Une approche unique pour transformer votre présence digitale.",
  image = "https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6",
  url = typeof window !== 'undefined' ? window.location.href : 'https://aureus.agency',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = []
}) => {
  const fullTitle = title.includes('Aureus') ? title : `${title} | Aureus`;
  const siteName = 'Agence Digitale Aureus';

  return (
    <>
      {/* Basic Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.length > 0 ? tags.join(', ') : 'agence digitale, développement web, production vidéo, branding, marketing digital, automatisation, IA, VFX, 3D, community management'} />
      <meta name="author" content={author || 'Agence Digitale Aureus'} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />

      {/* Structured Data - Article (if type is article) */}
      {type === 'article' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      )}

      {/* Structured Data - Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
    </>
  );
};

