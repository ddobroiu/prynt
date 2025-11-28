"use client";
import { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { MAIN_CONFIGURATORS, EMAIL_CATEGORIES } from '@/lib/emailMarketing';

interface Props {
  source?: 'footer' | 'popup' | 'configurator' | 'checkout';
  configuratorId?: string;
  compact?: boolean;
}

export default function NewsletterSignup({ source = 'footer', configuratorId, compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>(configuratorId ? [configuratorId] : []);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          interests,
          source,
          utmParams: {
            source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
            medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
            campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Te-ai abonat cu succes! Verifică email-ul pentru confirmare.');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.message || 'A apărut o eroare. Încearcă din nou.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Eroare de conexiune. Încearcă din nou.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  const toggleInterest = (configuratorId: string) => {
    setInterests(prev => 
      prev.includes(configuratorId) 
        ? prev.filter(id => id !== configuratorId)
        : [...prev, configuratorId]
    );
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email-ul tău"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'loading' ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : status === 'success' ? (
            <Check size={16} />
          ) : (
            <Mail size={16} />
          )}
          <span className="hidden sm:inline">
            {status === 'success' ? 'Abonat!' : 'Abonează-te'}
          </span>
        </button>
      </form>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Mail className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">
            {configuratorId ? 'Primește Oferte Exclusive' : 'Newsletter Configuratoare'}
          </h3>
          <p className="text-sm text-gray-600">
            {configuratorId 
              ? `Află primul despre oferte speciale pentru ${MAIN_CONFIGURATORS.find(c => c.id === configuratorId)?.title}`
              : 'Oferte exclusive, ghiduri practice și noutăți din lumea tiparului digital'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email-ul tău *"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={status === 'loading'}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Numele tău (opțional)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={status === 'loading'}
          />
        </div>

        {!configuratorId && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Sunt interesat de:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(EMAIL_CATEGORIES).map(([categoryId, category]) => (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => {
                    const categoryProducts: readonly string[] = category.products;
                    const hasAll = categoryProducts.every((id: string) => interests.includes(id));
                    if (hasAll) {
                      setInterests(prev => prev.filter((id: string) => !categoryProducts.includes(id)));
                    } else {
                      setInterests(prev => [...new Set([...prev, ...categoryProducts])]);
                    }
                  }}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                    category.products.every(id => interests.includes(id))
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {status === 'success' ? 'Abonat cu succes!' : 'Abonează-te gratuit'}
          </button>
          
          <p className="text-xs text-gray-500">
            Fără spam. Dezabonare oricând.
          </p>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          status === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {status === 'success' ? <Check size={16} /> : <X size={16} />}
          {message}
        </div>
      )}
    </div>
  );
}