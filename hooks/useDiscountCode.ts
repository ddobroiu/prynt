"use client";
import { useState, useCallback } from 'react';

interface DiscountValidation {
  isValid: boolean;
  error?: string;
  discount?: {
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    amount: number;
  };
}

interface UseDiscountCodeResult {
  discountCode: string;
  isValidating: boolean;
  isValid: boolean | null;
  validation: DiscountValidation | null;
  error: string | null;
  appliedDiscount: number;
  setDiscountCode: (code: string) => void;
  validateCode: (orderValue: number, configuratorId?: string) => Promise<void>;
  applyCode: () => Promise<boolean>;
  clearCode: () => void;
  getDiscountDisplay: () => string;
  calculateFinalPrice: (originalPrice: number) => number;
}

export function useDiscountCode(): UseDiscountCodeResult {
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validation, setValidation] = useState<DiscountValidation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const validateCode = useCallback(async (orderValue: number, configuratorId?: string) => {
    if (!discountCode.trim()) {
      setError('Introdu un cod de reducere');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch('/api/discount-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate',
          code: discountCode.toUpperCase(),
          orderValue,
          configuratorId
        })
      });

      const result = await response.json();

      if (response.ok && result.isValid) {
        setIsValid(true);
        setValidation(result);
        setAppliedDiscount(result.discount?.amount || 0);
        setError(null);
      } else {
        setIsValid(false);
        setValidation(null);
        setAppliedDiscount(0);
        setError(result.error || 'Cod invalid');
      }
    } catch (err) {
      setIsValid(false);
      setValidation(null);
      setAppliedDiscount(0);
      setError('Eroare la validarea codului');
      console.error('[Discount] Validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  }, [discountCode]);

  const applyCode = useCallback(async (): Promise<boolean> => {
    if (!isValid || !discountCode) {
      setError('Codul nu este valid');
      return false;
    }

    try {
      const response = await fetch('/api/discount-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'apply',
          code: discountCode.toUpperCase()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Track discount code usage
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'discount_code_used', {
            event_category: 'ecommerce',
            event_label: discountCode.toUpperCase(),
            value: appliedDiscount
          });
        }
        return true;
      } else {
        setError('Eroare la aplicarea codului');
        return false;
      }
    } catch (err) {
      setError('Eroare la aplicarea codului');
      console.error('[Discount] Apply failed:', err);
      return false;
    }
  }, [discountCode, isValid, appliedDiscount]);

  const clearCode = useCallback(() => {
    setDiscountCode('');
    setIsValid(null);
    setValidation(null);
    setError(null);
    setAppliedDiscount(0);
  }, []);

  const getDiscountDisplay = useCallback((): string => {
    if (!validation?.discount) return '';

    switch (validation.discount.type) {
      case 'percentage':
        return `${validation.discount.value}% reducere`;
      case 'fixed':
        return `${validation.discount.value} RON reducere`;
      case 'free_shipping':
        return 'Livrare gratuită';
      default:
        return '';
    }
  }, [validation]);

  const calculateFinalPrice = useCallback((originalPrice: number): number => {
    if (!isValid || !appliedDiscount) return originalPrice;
    return Math.max(0, originalPrice - appliedDiscount);
  }, [isValid, appliedDiscount]);

  return {
    discountCode,
    isValidating,
    isValid,
    validation,
    error,
    appliedDiscount,
    setDiscountCode,
    validateCode,
    applyCode,
    clearCode,
    getDiscountDisplay,
    calculateFinalPrice
  };
}

export default useDiscountCode;