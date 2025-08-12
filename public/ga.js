// ga.js - Google Analytics for both domains

(function() {
  const GA_MEASUREMENT_IDS = ['G-DXLS10MB0D', 'G-BJSCMQL00W'];

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_IDS[0]}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());

  GA_MEASUREMENT_IDS.forEach(id => {
    gtag('config', id, {
      // Enable cross-domain tracking
      'linker': {
        'domains': ['netlookup.io', 'netscan.visnec.ai']
      }
    });
  });

  // Track page views
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });

  console.log('Google Analytics initialized with IDs:', GA_MEASUREMENT_IDS);
})();