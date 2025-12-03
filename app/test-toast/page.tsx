'use client';

import { useToast } from '@/components/ToastProvider';

/**
 * Componentă de testare pentru Toast Notifications
 * Accesibilă la: /test-toast
 * 
 * Permite testarea rapidă a tuturor tipurilor de notificări
 */
export default function ToastTestPage() {
  const toast = useToast();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent mb-4">
            Toast Notifications Test
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Testează toate tipurile de notificări toast implementate în sistem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Success Toasts */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                ✅ Success Toasts
              </h2>
              
              <button
                onClick={() => toast.success('Produs adăugat în coș!')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Produs Adăugat
              </button>
              
              <button
                onClick={() => toast.success('Cantitate actualizată în coș!')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cantitate Actualizată
              </button>
              
              <button
                onClick={() => toast.success('Comandă plasată cu succes!')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Comandă Plasată
              </button>
            </div>

            {/* Error Toasts */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                ❌ Error Toasts
              </h2>
              
              <button
                onClick={() => toast.error('A apărut o eroare la procesarea plății!')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Eroare Plată
              </button>
              
              <button
                onClick={() => toast.error('Produsul nu mai este disponibil!')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Produs Indisponibil
              </button>
              
              <button
                onClick={() => toast.error('Sesiunea a expirat. Te rugăm să te autentifici din nou.')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Sesiune Expirată
              </button>
            </div>

            {/* Warning Toasts */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
                ⚠️ Warning Toasts
              </h2>
              
              <button
                onClick={() => toast.warning('Te rugăm să completezi toate câmpurile obligatorii!')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Câmpuri Incomplete
              </button>
              
              <button
                onClick={() => toast.warning('Limita maximă pentru plata ramburs este 500 RON!')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Limită Ramburs
              </button>
              
              <button
                onClick={() => toast.warning('Stocul pentru acest produs este limitat!')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Stoc Limitat
              </button>
            </div>

            {/* Info Toasts */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                ℹ️ Info Toasts
              </h2>
              
              <button
                onClick={() => toast.info('Cantitate modificată!')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cantitate Modificată
              </button>
              
              <button
                onClick={() => toast.info('Coș golit!')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Coș Golit
              </button>
              
              <button
                onClick={() => toast.info('Timpul estimat de livrare: 3-5 zile lucrătoare')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Info Livrare
              </button>
            </div>
          </div>

          {/* Multiple Toasts Test */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              🔄 Test Multiple Toasts
            </h2>
            
            <button
              onClick={() => {
                toast.success('Prima notificare');
                setTimeout(() => toast.info('A doua notificare'), 500);
                setTimeout(() => toast.warning('A treia notificare'), 1000);
                setTimeout(() => toast.error('A patra notificare'), 1500);
              }}
              className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-800 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Afișează 4 Toast-uri Consecutive
            </button>
          </div>

          {/* Info Panel */}
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              📝 Notă
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Toast-urile apar în colțul dreapta-sus</li>
              <li>• Dispar automat după 4-5 secunde</li>
              <li>• Poți afișa multiple toast-uri simultan</li>
              <li>• Funcționează în dark mode</li>
              <li>• Responsive pe mobile și desktop</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
