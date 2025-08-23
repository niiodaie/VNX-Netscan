// Analytics tracking stub for VisPrint
// In a real application, this would integrate with Google Analytics, Mixpanel, etc.

export function track(event, payload = {}) {
  // Log to console for development
  console.log('Analytics Event:', event, payload);
  
  // In production, this would send data to your analytics service
  // Example: gtag('event', event, payload);
  // Example: mixpanel.track(event, payload);
}

// Common event tracking functions
export function trackPageView(page) {
  track('page_view', { page });
}

export function trackProductView(productId, productName) {
  track('product_view', { 
    product_id: productId,
    product_name: productName 
  });
}

export function trackAddToCart(productId, productName, quantity, price) {
  track('add_to_cart', {
    product_id: productId,
    product_name: productName,
    quantity,
    price,
    value: price * quantity
  });
}

export function trackQuoteRequest(items, totalValue) {
  track('quote_request', {
    items_count: items.length,
    total_value: totalValue,
    items: items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.qty,
      price: item.product.price
    }))
  });
}

export function trackContactForm(formData) {
  track('contact_form_submit', {
    has_company: !!formData.company,
    message_length: formData.message?.length || 0
  });
}

export function trackNavigation(from, to) {
  track('navigation', { from, to });
}

export function trackCategoryFilter(category) {
  track('category_filter', { category });
}

export function trackLogoUpload(fileSize, fileType) {
  track('logo_upload', { 
    file_size: fileSize,
    file_type: fileType 
  });
}

