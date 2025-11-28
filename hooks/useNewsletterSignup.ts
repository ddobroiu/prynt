"use client";
import { useState, useCallback } from 'react';

interface NewsletterSignupState {
  email: string;
  interests: string[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

interface UseNewsletterSignupResult extends NewsletterSignupState {
  updateEmail: (email: string) => void;
  toggleInterest: (interest: string) => void;
  setInterests: (interests: string[]) => void;
  handleSubmit: (utmData?: { source?: string; medium?: string; campaign?: string }) => Promise<void>;
  reset: () => void;
}

const initialState: NewsletterSignupState = {
  email: '',
  interests: [],
  isLoading: false,
  isSuccess: false,
  error: null
};

export function useNewsletterSignup(): UseNewsletterSignupResult {
  const [state, setState] = useState<NewsletterSignupState>(initialState);

  const updateEmail = useCallback((email: string) => {
    setState(prev => ({ ...prev, email, error: null }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setState(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
      error: null
    }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setState(prev => ({ ...prev, interests, error: null }));
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(async (utmData?: { source?: string; medium?: string; campaign?: string }) => {
    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: 'Te rugăm să introduci o adresă de email validă' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
          interests: state.interests,
          utmSource: utmData?.source || 'website',
          utmMedium: utmData?.medium || 'newsletter_signup',
          utmCampaign: utmData?.campaign || 'general'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la înregistrare');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: true,
        error: null
      }));

      // Track newsletter signup event for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: state.interests.join(','),
          value: state.interests.length
        });
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Eroare la înregistrare'
      }));
    }
  }, [state.email, state.interests]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    updateEmail,
    toggleInterest,
    setInterests,
    handleSubmit,
    reset
  };
}

export default useNewsletterSignup;