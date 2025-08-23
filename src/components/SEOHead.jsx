import { useEffect } from 'react';

export default function SEOHead({ 
  title = "VisPrint – Custom Printing & Promotional Products",
  description = "Professional custom printing services for apparel, drinkware, promotional items, and more. Get free mockups and competitive pricing for your brand.",
  canonical = "https://visprint.com/",
  ogImage = "/og-cover.png",
  structuredData = null
}) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonical);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonical);
    }
    
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute('content', ogImage);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', canonical);
    }
    
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    
    // Update structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, canonical, ogImage, structuredData]);

  return null; // This component doesn't render anything
}

// SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "VisPrint – Custom Printing & Promotional Products",
    description: "Professional custom printing services for apparel, drinkware, promotional items, and more. Get free mockups and competitive pricing for your brand.",
    canonical: "https://visprint.com/"
  },
  catalog: {
    title: "Product Catalog – VisPrint Custom Printing",
    description: "Browse our extensive catalog of customizable products including apparel, drinkware, office supplies, bags, and promotional items.",
    canonical: "https://visprint.com/catalog"
  },
  quote: {
    title: "Get a Free Quote – VisPrint Custom Printing",
    description: "Request a free quote for your custom printing project. Upload your logo and get pricing for apparel, promotional items, and more.",
    canonical: "https://visprint.com/quote"
  },
  pricing: {
    title: "Pricing Plans – VisPrint Custom Printing",
    description: "Transparent pricing for all your custom printing needs. Choose from Starter, Business, or Enterprise plans with no hidden fees.",
    canonical: "https://visprint.com/pricing"
  },
  about: {
    title: "About Us – VisPrint Custom Printing",
    description: "Learn about VisPrint's mission to simplify custom printing with quality products, fast turnaround, and exceptional service.",
    canonical: "https://visprint.com/about"
  },
  contact: {
    title: "Contact Us – VisPrint Custom Printing",
    description: "Get in touch with VisPrint for custom printing questions, support, or to discuss your project needs.",
    canonical: "https://visprint.com/contact"
  },
  dashboard: {
    title: "Dashboard – VisPrint Custom Printing",
    description: "Track your orders, manage saved items, and view your custom printing project history.",
    canonical: "https://visprint.com/dashboard"
  }
};

// Product-specific SEO generator
export function getProductSEO(product) {
  return {
    title: `${product.name} – Custom Printing | VisPrint`,
    description: `Customize ${product.name} with your logo. Starting at $${product.price.toFixed(2)} with minimum order of ${product.min} units. Get a free mockup today.`,
    canonical: `https://visprint.com/product/${product.id}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": `Custom ${product.name} with your logo or design`,
      "brand": {
        "@type": "Brand",
        "name": "VisPrint"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "VisPrint"
        }
      },
      "image": `https://visprint.com/images/products/${product.id}.png`
    }
  };
}

