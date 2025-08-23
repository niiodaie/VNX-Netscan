/**
 * Client helper for requesting quotes via Supabase Edge Function
 */

import { supabase } from './supabaseClient';

export interface QuoteRequestPayload {
  customerEmail: string;
  customerName?: string;
  companyName?: string;
  phone?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    decorationMethod: string;
    placement: string;
    color: string;
    subtotal: number;
  }>;
  logoFile?: File;
  additionalNotes?: string;
  urgentDeadline?: string;
}

export interface QuoteRequestResponse {
  ok: boolean;
  message?: string;
  quoteId?: string;
  error?: string;
}

/**
 * Submit a quote request via Supabase Edge Function
 */
export async function requestQuote(payload: QuoteRequestPayload): Promise<QuoteRequestResponse> {
  try {
    // Validate required fields
    if (!payload.customerEmail) {
      throw new Error('Customer email is required');
    }
    
    if (!payload.items || payload.items.length === 0) {
      throw new Error('At least one item is required');
    }

    // Prepare form data for file upload if logo is provided
    let requestBody: any = {
      customerEmail: payload.customerEmail,
      customerName: payload.customerName || '',
      companyName: payload.companyName || '',
      phone: payload.phone || '',
      items: payload.items,
      additionalNotes: payload.additionalNotes || '',
      urgentDeadline: payload.urgentDeadline || '',
    };

    // If logo file is provided, convert to base64
    if (payload.logoFile) {
      const logoBase64 = await fileToBase64(payload.logoFile);
      requestBody.logoFile = {
        name: payload.logoFile.name,
        type: payload.logoFile.type,
        size: payload.logoFile.size,
        data: logoBase64,
      };
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('request-quote-email', {
      body: requestBody,
    });

    if (error) {
      console.error('Supabase function error:', error);
      return {
        ok: false,
        error: error.message || 'Failed to submit quote request',
      };
    }

    return {
      ok: true,
      message: data?.message || 'Quote request submitted successfully',
      quoteId: data?.quoteId,
    };

  } catch (error) {
    console.error('Quote request error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 data
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate total quote value
 */
export function calculateQuoteTotal(items: QuoteRequestPayload['items']): number {
  return items.reduce((total, item) => total + item.subtotal, 0);
}

