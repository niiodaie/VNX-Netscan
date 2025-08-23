// Currency formatting utilities for VisPrint

export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPriceCompact(amount, currency = 'USD') {
  if (amount < 1) {
    return formatPrice(amount, currency);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculateSubtotal(cartItems) {
  return cartItems.reduce((total, item) => {
    return total + (item.product.price * item.qty);
  }, 0);
}

export function calculateTax(subtotal, taxRate = 0.08) {
  return subtotal * taxRate;
}

export function calculateShipping(subtotal, freeShippingThreshold = 500) {
  if (subtotal >= freeShippingThreshold) {
    return 0;
  }
  return 25; // Standard shipping fee
}

export function calculateTotal(cartItems, taxRate = 0.08, freeShippingThreshold = 500) {
  const subtotal = calculateSubtotal(cartItems);
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, freeShippingThreshold);
  
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping
  };
}

export function formatQuantity(quantity, unit = 'units') {
  if (quantity === 1) {
    return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
  }
  return `${quantity} ${unit}`;
}

export function calculatePriceBreaks(basePrice, quantity) {
  // Simple volume discount calculation
  let discount = 0;
  
  if (quantity >= 100) {
    discount = 0.15; // 15% off for 100+
  } else if (quantity >= 50) {
    discount = 0.10; // 10% off for 50+
  } else if (quantity >= 25) {
    discount = 0.05; // 5% off for 25+
  }
  
  const discountedPrice = basePrice * (1 - discount);
  
  return {
    originalPrice: basePrice,
    discountedPrice,
    discount,
    savings: (basePrice - discountedPrice) * quantity
  };
}

