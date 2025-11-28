'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface SmartNewsletterPopupProps {
  onSubscribe?: (email: string) => void;
  delay?: number; // Delay in seconds before showing
}

export default function SmartNewsletterPopup({ 
  onSubscribe, 
  delay = 30 
}: SmartNewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    const dismissed = sessionStorage.getItem('newsletter-popup-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Don't show if already subscribed
    const subscribed = localStorage.getItem('newsletter-subscribed');
    if (subscribed) {
      setIsDismissed(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let exitIntentAdded = false;

    // Show after delay
    const schedulePopup = () => {
      timeoutId = setTimeout(() => {
        if (!isDismissed) {
          setIsVisible(true);
        }
      }, delay * 1000);
    };

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isDismissed && !isVisible) {
        clearTimeout(timeoutId);
        setIsVisible(true);
      }
    };

    // Page visibility change (mobile detection)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isDismissed && !isVisible) {
        clearTimeout(timeoutId);
        setIsVisible(true);
      }
    };

    // Scroll tracking (show after 50% page scroll)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50 && !isDismissed && !isVisible) {
        clearTimeout(timeoutId);
        setIsVisible(true);
      }
    };

    // Start timer and add event listeners
    schedulePopup();

    const addExitIntent = () => {
      if (!exitIntentAdded) {
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('scroll', handleScroll);
        exitIntentAdded = true;
      }
    };

    // Add exit intent after a few seconds
    setTimeout(addExitIntent, 5000);

    return () => {
      clearTimeout(timeoutId);
      if (exitIntentAdded) {
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [delay, isDismissed, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('newsletter-popup-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'smart-popup',
          configuratorId: 'general' 
        })
      });

      if (response.ok) {
        // Mark as subscribed
        localStorage.setItem('newsletter-subscribed', 'true');
        
        // Call callback if provided
        onSubscribe?.(email);
        
        // Show success and close
        alert('✅ Mulțumim! Vei primi un cod de reducere pe email!');
        handleClose();
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('❌ A apărut o eroare. Te rugăm să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header with gradient */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Gift size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            🎁 Cod de reducere 10%
          </h2>
          <p className="text-blue-100 text-sm">
            Primești instant un cod de 10% reducere!
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Adresa ta de email:
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="popup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Se trimite...
                </span>
              ) : (
                '🎉 Vreau codul de 10% reducere!'
              )}
            </button>
          </form>

          {/* Benefits list */}
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Cod de reducere instant 10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Oferte exclusive săptămânale</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Fără spam, îți trimitem doar ofertele bune</span>
            </div>
          </div>

          {/* Privacy note */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Respectăm confidențialitatea datelor tale. 
            <br />
            Te poți dezabona oricând cu un click.
          </p>
        </div>
      </div>
    </div>
  );
}