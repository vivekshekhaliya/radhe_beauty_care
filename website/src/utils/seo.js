/**
 * Helper to dynamically inject SEO tags, OpenGraph elements, and Schema Markups.
 */
export function updateSEO({ title, description, keywords, ogImage, canonicalUrl, pageType = "beauty-salon" }) {
  // 1. Update document title
  document.title = title ? `${title} | Radhe Beauty Care` : "Radhe Beauty Care | Premium Makeup, Skin & Hair Care Salon in Surat";

  // 2. Update meta tags
  updateMetaTag("description", description || "Indulge in a premium luxury salon experience. Specialist bridal transformations, custom skincare remedies, and elegant hair restyling by Kajal Shekhaliya.");
  updateMetaTag("keywords", keywords || "Radhe Beauty Care, Kajal Shekhaliya, bridal makeup Surat, hair treatment Yogi Chowk, beauty academy, skin care, nail art Surat");

  // 3. Open Graph Tags
  updateMetaTag("og:title", title || "Radhe Beauty Care | Premium Salon & Academy");
  updateMetaTag("og:description", description || "Luxurious makeup, skin, hair and nail treatments by certified specialist Kajal Shekhaliya.");
  updateMetaTag("og:image", ogImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800");
  updateMetaTag("og:url", canonicalUrl || window.location.href);
  updateMetaTag("og:type", "website");

  // 4. Inject Schema Markup (JSON-LD)
  injectSchemaMarkup(pageType);
}

function updateMetaTag(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    if (name.startsWith("og:")) {
      element.setAttribute("property", name);
    } else {
      element.setAttribute("name", name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
}

function injectSchemaMarkup(pageType) {
  // Remove existing schema scripts
  const existingSchemas = document.querySelectorAll("script[type='application/ld+json']");
  existingSchemas.forEach((el) => el.remove());

  // Define structured JSON-LD schema
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Radhe Beauty Care",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    "@id": "https://radhebeautycare.com/#salon",
    "url": "https://radhebeautycare.com",
    "telephone": "+919328412418",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1st Floor, Royal Arcade, Opposite Golden Plaza, Yogi Chowk",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "395010",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.2148",
      "longitude": "72.8884"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "14:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/radhe_beauty_care03/"
    ]
  };

  const academySchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Radhe Beauty Academy",
    "url": "https://radhebeautycare.com/academy",
    "description": "Professional training academy in makeup, hair styling, nail art, and skin treatments led by Kajal Shekhaliya.",
    "parentOrganization": {
      "@type": "BeautySalon",
      "name": "Radhe Beauty Care"
    }
  };

  const selectedSchema = pageType === "academy" ? academySchema : businessSchema;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(selectedSchema);
  document.head.appendChild(script);
}
