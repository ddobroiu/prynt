"use client";

import { useState } from 'react';
import { Check, X, Percent, Tag } from 'lucide-react';

interface DiscountCodeInputProps {
  subtotal: number;
  configuratorId?: string;
  onDiscountApplied: (discount: { type: string; value: number; amount: number } | null) => void;
}

export default function DiscountCodeInput({ 
  subtotal, 
  configuratorId, 
  onDiscountApplied 
}: DiscountCodeInputProps) {
  const [inputCode, setInputCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: string;
    value: number;
    amount: number;
  } | null>(null);

  const handleApplyCode = async () => {
    if (!inputCode.trim()) {
      setError('Introdu un cod de reducere');
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
          code: inputCode.trim().toUpperCase(),
          orderValue: subtotal,
          configuratorId
        })
      });

      const result = await response.json();

      if (response.ok && result.isValid && result.discount) {
        setAppliedDiscount({
          code: inputCode.trim().toUpperCase(),
          type: result.discount.type,
          value: result.discount.value,
          amount: result.discount.amount
        });
        onDiscountApplied(result.discount);
        setInputCode('');
        setError(null);
      } else {
        setError(result.error || 'Cod invalid sau expirat');
      }
    } catch (err) {
      console.error('Discount code error:', err);
      setError('Eroare la validarea codului. Încearcă din nou.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCode = () => {
    setAppliedDiscount(null);
    onDiscountApplied(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };

  const formatDiscount = () => {
    if (!appliedDiscount) return '';
    
    if (appliedDiscount.type === 'percentage') {
      return `${appliedDiscount.value}%`;
    } else if (appliedDiscount.type === 'fixed') {
      return new Intl.NumberFormat("ro-RO", { 
        style: "currency", 
        currency: "RON", 
        maximumFractionDigits: 2 
      }).format(appliedDiscount.value);
    } else if (appliedDiscount.type === 'free_shipping') {
      return 'Livrare gratuită';
    }
    return '';
  };

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-100 rounded-full">
            <Check size={14} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-800">
              Cod aplicat: {appliedDiscount.code || 'DISCOUNT'}
            </div>
            <div className="text-xs text-emerald-600">
              Reducere: {formatDiscount()}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemoveCode}
          className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
          title="Elimină codul"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Cod de reducere"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
            disabled={isValidating}
          />
          <Tag size={16} className="absolute right-2 top-2.5 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleApplyCode}
          disabled={!inputCode.trim() || isValidating}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-slate-700 font-medium text-sm rounded-lg transition-colors flex items-center gap-1"
        >
          {isValidating ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Percent size={16} />
          )}
          Aplică
        </button>
      </div>
      
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-2">
          <X size={14} />
          {error}
        </div>
      )}
    </div>
  );
}