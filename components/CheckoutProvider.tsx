// components/CheckoutProvider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// --- 1. DEFINIȚII DE TIP ---

// Tipuri pentru adresa de livrare și facturare
interface Address {
  nume_prenume: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  cod_postal?: string;
}

// Tipuri pentru datele de facturare (persoană fizică sau companie)
interface Billing {
  tip_factura: 'persoana_fizica' | 'companie';
  cui_cnp: string;
  nume_companie?: string; // Doar pentru tip_factura = 'companie'
  adresa_facturare: string; // Adresa completă, o poți separa mai târziu
}

// Starea centrală a procesului de checkout
interface CheckoutState {
  step: 1 | 2 | 3; // 1: Livrare/Facturare, 2: Plată, 3: Confirmare
  delivery: Address;
  billing: Billing;
  metoda_plata: 'ramburs' | 'card';
}

// Starea inițială a formularului
const initialCheckoutState: CheckoutState = {
  step: 1, 
  delivery: {
    nume_prenume: '',
    telefon: '',
    judet: '',
    localitate: '',
    strada_nr: '',
  },
  billing: {
    tip_factura: 'persoana_fizica',
    cui_cnp: '', // CNP pentru PF, CUI pentru Companie
    adresa_facturare: '',
  },
  metoda_plata: 'ramburs', // Default la plata la livrare
};

// Tipul Contextului
type CheckoutContextType = {
  state: CheckoutState;
  updateDeliveryField: <T extends keyof Address>(key: T, value: Address[T]) => void;
  updateBillingField: <T extends keyof Billing>(key: T, value: Billing[T]) => void;
  setPaymentMethod: (method: CheckoutState['metoda_plata']) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetCheckout: () => void;
};

// Crearea Contextului
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// --- 2. HOOK UTILITAR ---

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout trebuie folosit în interiorul unui CheckoutProvider');
  }
  return context;
};

// --- 3. PROVIDERUL ---

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialCheckoutState);

  // Funcție generică pentru actualizarea câmpurilor de livrare
  const updateDeliveryField = useCallback(<T extends keyof Address>(key: T, value: Address[T]) => {
    setState(prevState => ({
      ...prevState,
      delivery: {
        ...prevState.delivery,
        [key]: value,
      },
    }));
  }, []);

  // Funcție generică pentru actualizarea câmpurilor de facturare
  const updateBillingField = useCallback(<T extends keyof Billing>(key: T, value: Billing[T]) => {
    setState(prevState => ({
      ...prevState,
      billing: {
        ...prevState.billing,
        [key]: value,
      },
    }));
  }, []);

  const setPaymentMethod = useCallback((method: CheckoutState['metoda_plata']) => {
    setState(prevState => ({ ...prevState, metoda_plata: method }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prevState => ({ ...prevState, step: (prevState.step + 1) as CheckoutState['step'] }));
  }, []);
  
  const prevStep = useCallback(() => {
    setState(prevState => ({ ...prevState, step: (prevState.step - 1) as CheckoutState['step'] }));
  }, []);

  const resetCheckout = useCallback(() => {
    setState(initialCheckoutState);
  }, []);

  return (
    <CheckoutContext.Provider 
      value={{ 
        state, 
        updateDeliveryField, 
        updateBillingField, 
        setPaymentMethod,
        nextStep,
        prevStep,
        resetCheckout
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}