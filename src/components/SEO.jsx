import { Helmet } from 'react-helmet-async'

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  published,
  modified,
  section,
  tags,
  articleData
}) => {
  // Base configuration
  const siteName = 'Biovance'
  const siteUrl = 'https://biovance.ai'
  const defaultImage = 'https://biovance.ai/assets/myanmar_tm5_2004349_lrg.jpg'
  const defaultDescription = 'Exploring the intelligence of nature through AI-powered conservation research. Join our mission to protect biodiversity using cutting-edge machine learning and ecological insights.'

  // Construct full title
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - AI That Learns from Nature | Conservation Research`

  // Construct full URL
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl

  // Construct full image URL
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage

  // Use provided description or default
  const metaDescription = description || defaultDescription

  // Keywords
  const metaKeywords = keywords || 'AI conservation, biodiversity research, machine learning ecology, nature intelligence, environmental technology, conservation AI, ecological research'

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      "name": title || siteName,
      "url": fullUrl,
      "description": metaDescription,
      "image": fullImage
    }

    if (type === 'article' && articleData) {
      return {
        ...baseData,
        "@type": "Article",
        "headline": title,
        "author": {
          "@type": "Person",
          "name": author || "Biovance Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": defaultImage
          }
        },
        "datePublished": published,
        "dateModified": modified || published,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        "articleSection": section || "Conservation Research",
        "keywords": tags || []
      }
    }

    if (type === 'website') {
      return {
        ...baseData,
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": defaultImage
          }
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    }

    return baseData
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author || siteName} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article specific meta tags */}
      {type === 'article' && published && (
        <meta property="article:published_time" content={published} />
      )}
      {type === 'article' && modified && (
        <meta property="article:modified_time" content={modified} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Theme color */}
      <meta name="theme-color" content="#36A476" />
      <meta name="msapplication-TileColor" content="#36A476" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Breadcrumbs structured data for articles */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Updates",
                "item": `${siteUrl}/updates`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": fullUrl
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  )
}

export default SEO