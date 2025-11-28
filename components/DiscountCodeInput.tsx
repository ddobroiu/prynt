"use client";

import { useState } from 'react';
import { useDiscountCode } from '@/hooks/useDiscountCode';
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
  const { 
    validateCode, 
    applyCode, 
    appliedDiscount, 
    isValidating, 
    error,
    clearDiscount 
  } = useDiscountCode();

  const handleApplyCode = async () => {
    if (!inputCode.trim()) return;
    
    const result = await validateCode(inputCode.trim(), subtotal, configuratorId);
    if (result.isValid && result.discount) {
      const applied = await applyCode(inputCode.trim());
      if (applied) {
        onDiscountApplied(result.discount);
        setInputCode('');
      }
    }
  };

  const handleRemoveCode = () => {
    clearDiscount();
    onDiscountApplied(null);
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