"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordForm() {
  // Stări pentru valorile input-urilor
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  
  // Stări pentru vizibilitatea parolelor (ochiul)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Stări pentru procesare și mesaje
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    // Validare simplă pe client
    if (next.length < 6) {
      setErr("Parola nouă trebuie să aibă minim 6 caractere.");
      return;
    }
    if (next !== confirm) {
      setErr("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // Trimitem undefined dacă string-ul e gol
          currentPassword: current || undefined, 
          newPassword: next 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'A apărut o eroare la schimbarea parolei.');
      }

      setMsg('Parola a fost actualizată cu succes.');
      // Resetăm câmpurile
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e: any) {
      setErr(e?.message || 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-[--border] p-4 space-y-3">
      <div className="font-semibold">Schimbă parola</div>
      <p className="text-xs text-muted">
        Completează câmpurile de mai jos pentru a actualiza parola contului tău.
      </p>
      
      {/* Câmp Parola Curentă */}
      <div className="relative">
        <input
          type={showCurrent ? "text" : "password"}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Parola curentă"
          className="w-full rounded-md border border-[--border] bg-surface pl-3 pr-10 py-2 text-sm"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowCurrent(!showCurrent)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1} // Sărim peste buton la navigarea cu Tab pentru rapiditate
        >
          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Câmp Parola Nouă */}
      <div className="relative">
        <input
          type={showNext ? "text" : "password"}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="Parola nouă (min. 6 caractere)"
          className="w-full rounded-md border border-[--border] bg-surface pl-3 pr-10 py-2 text-sm"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowNext(!showNext)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Câmp Confirmare Parolă */}
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirmă parola nouă"
          className="w-full rounded-md border border-[--border] bg-surface pl-3 pr-10 py-2 text-sm"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Buton Salvare */}
      <button
        disabled={loading || !next || !confirm}
        onClick={submit}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Se procesează...' : 'Salvează parola'}
      </button>

      {/* Mesaje de Erorare / Succes */}
      {err && <p className="text-red-500 text-xs font-medium mt-2">{err}</p>}
      {msg && <p className="text-emerald-500 text-xs font-medium mt-2">{msg}</p>}
    </div>
  );
}