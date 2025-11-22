"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null); // Șterge eroarea când utilizatorul începe să scrie din nou
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'A apărut o eroare la trimitere.');
      }

      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" }); // Reset form
    } catch (err: any) {
      setError(err.message || "Ceva nu a funcționat. Te rugăm să încerci din nou sau să ne suni.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text flex items-center justify-center lg:p-8 p-0">
      <div className="w-full max-w-[1600px] bg-card-bg lg:rounded-[2rem] overflow-hidden shadow-2xl border border-border min-h-screen lg:min-h-[800px] flex flex-col lg:flex-row">
        
        {/* Left Panel - Info & Branding */}
        <div className="relative lg:w-5/12 bg-surface p-8 lg:p-16 flex flex-col justify-between overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

            <div className="relative z-10">
                <Link href="/" className="inline-block mb-12 opacity-80 hover:opacity-100 transition">
                    <span className="text-sm font-bold tracking-widest uppercase text-muted">← Înapoi la site</span>
                </Link>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-ui mb-6">
                    Hai să <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">colaborăm.</span>
                </h1>
                <p className="text-lg text-muted max-w-md leading-relaxed">
                    Fie că ai nevoie de materiale publicitare, printuri de mari dimensiuni sau doar un sfat, suntem aici.
                </p>
            </div>

            <div className="relative z-10 mt-12 space-y-8">
                <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300 shadow-sm">
                        <svg className="w-5 h-5 text-ui group-hover:text-accent transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Email</h3>
                        <a href="mailto:contact@prynt.ro" className="text-muted hover:text-accent transition-colors">contact@prynt.ro</a>
                    </div>
                </div>

                <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all duration-300 shadow-sm">
                         <svg className="w-5 h-5 text-ui group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Telefon & WhatsApp</h3>
                        <a href="tel:0750473111" className="text-muted hover:text-green-500 transition-colors">0750 473 111</a>
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center shadow-sm">
                         <svg className="w-5 h-5 text-ui" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Locație</h3>
                        <p className="text-muted">România, Online & Livrare Națională</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-7/12 bg-card-bg p-8 lg:p-20 flex flex-col justify-center relative">
            {sent ? (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-ui mb-4">Mesaj recepționat!</h2>
                    <p className="text-muted mb-8 max-w-md mx-auto">Mulțumim că ne-ai contactat. Echipa noastră a primit detaliile și te va contacta în cel mai scurt timp posibil.</p>
                    <Button onClick={() => setSent(false)} variant="outline" size="lg">Trimite un alt mesaj</Button>
                </div>
            ) : (
                <div className="max-w-lg mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-ui mb-2">Trimite-ne un mesaj</h2>
                        <p className="text-muted">Completează formularul de mai jos.</p>
                    </div>

                    {error && (
                      <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-ui ml-1">Nume complet</label>
                                <Input 
                                    id="name" name="name" 
                                    placeholder="ex: Ion Popescu" 
                                    required 
                                    value={form.name} onChange={handleChange} 
                                    className="h-12 bg-surface border-border hover:border-accent/50 focus:border-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-semibold text-ui ml-1">Telefon (opțional)</label>
                                <Input 
                                    id="phone" name="phone" 
                                    placeholder="07xx xxx xxx" 
                                    value={form.phone} onChange={handleChange} 
                                    className="h-12 bg-surface border-border hover:border-accent/50 focus:border-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-ui ml-1">Adresă de email</label>
                            <Input 
                                id="email" name="email" type="email"
                                placeholder="ex: ion@gmail.com" 
                                required 
                                value={form.email} onChange={handleChange} 
                                className="h-12 bg-surface border-border hover:border-accent/50 focus:border-accent transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-semibold text-ui ml-1">Cu ce te putem ajuta?</label>
                            <textarea 
                                id="message" name="message" 
                                required 
                                rows={4}
                                placeholder="Salut, aș dori o ofertă pentru..."
                                value={form.message} onChange={handleChange}
                                className="flex w-full rounded-md border border-border bg-surface px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full h-14 text-base font-bold tracking-wide" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                                    Se trimite...
                                </span>
                            ) : "Trimite Mesajul"}
                        </Button>
                        
                        <p className="text-xs text-center text-muted mt-6">
                            Prin trimiterea acestui formular, ești de acord cu <Link href="/termeni" className="underline hover:text-ui">Termenii și Condițiile</Link> noastre.
                        </p>
                    </form>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}