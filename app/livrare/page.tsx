"use client";

import React from "react";
import Link from "next/link";
import { Truck, Package, MapPin, Clock, CheckCircle, CreditCard } from "lucide-react";

export default function LivrarePage() {
  return (
    <main className="min-h-screen bg-bg text-text flex items-center justify-center lg:p-8 p-0">
      <div className="w-full max-w-[1600px] bg-card-bg lg:rounded-4xl overflow-hidden shadow-2xl border border-border min-h-screen lg:min-h-[800px] flex flex-col lg:flex-row">
        
        {/* Left Panel - Info & Branding */}
        <div className="relative lg:w-5/12 bg-surface p-8 lg:p-16 flex flex-col justify-between overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

            <div className="relative z-10">
                <Link href="/" className="inline-block mb-12 opacity-80 hover:opacity-100 transition">
                    <span className="text-sm font-bold tracking-widest uppercase text-muted">? Înapoi la site</span>
                </Link>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-ui mb-6">
                    Livrare <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">rapida.</span>
                </h1>
                <p className="text-lg text-muted max-w-md leading-relaxed">
                    Transport rapid în toata România. Comenzile tale ajung la tine în 1-2 zile lucratoare.
                </p>
            </div>

            <div className="relative z-10 mt-12 space-y-8">
                <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-300 shadow-sm">
                        <Clock className="w-5 h-5 text-ui group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">1-2 zile</h3>
                        <p className="text-muted">Livrare în toata ?ara</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all duration-300 shadow-sm">
                        <CreditCard className="w-5 h-5 text-ui group-hover:text-green-500 transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Transport gratuit</h3>
                        <p className="text-muted">La comenzi peste 500 RON</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-300 shadow-sm">
                        <Package className="w-5 h-5 text-ui group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Urmarire AWB</h3>
                        <p className="text-muted">Real-time prin email & SMS</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-ui" />
                    </div>
                    <div>
                        <h3 className="font-bold text-ui">Ridicare personala</h3>
                        <p className="text-muted">GRATUIT din depozit</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel - Details */}
        <div className="lg:w-7/12 bg-card-bg p-8 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full space-y-12">
              
              {/* Costuri Transport */}
              <div>
                <h2 className="text-2xl font-bold text-ui mb-6">Costuri de Transport</h2>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-ui">
                            Valoare Comanda
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-ui">
                            Cost Livrare
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-bg/50 transition-colors">
                          <td className="px-6 py-4 text-ui font-medium">
                            Sub 500 RON
                          </td>
                          <td className="px-6 py-4 text-muted">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                              19.99 RON
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-green-500/5 transition-colors bg-green-500/5">
                          <td className="px-6 py-4 text-ui font-bold">
                            Peste 500 RON
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold">
                              <CheckCircle className="w-4 h-4" />
                              GRATUIT
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Timpi de Livrare */}
              <div>
                <h2 className="text-2xl font-bold text-ui mb-6">Timpi de Livrare</h2>
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ui mb-1">1-2 zile lucratoare</h3>
                      <p className="text-sm text-muted">
                        Toate produsele sunt procesate ?i livrate în <strong>1-2 zile lucratoare</strong> în toata România.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted">
                      <strong className="text-ui">Produse incluse:</strong> Bannere, Autocolante, Pliante, Flayere, Canvas, Tablouri, Materiale Rigide (PVC, Plexiglass, Alucobond).
                    </p>
                  </div>
                </div>
              </div>

              {/* Ridicare Personala */}
              <div>
                <h2 className="text-2xl font-bold text-ui mb-6">Ridicare din Depozit</h2>
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ui mb-1">GRATUIT - Fara costuri</h3>
                      <p className="text-sm text-muted">
                        Po?i ridica comanda personal din depozitul nostru, fara costuri suplimentare.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-bg border border-border rounded-xl p-4 space-y-2">
                    <p className="font-semibold text-ui text-sm">Program ridicari:</p>
                    <div className="text-sm text-muted space-y-1">
                      <p>?? <strong>Luni - Vineri:</strong> 09:00 - 18:00</p>
                      <p>?? <strong>Sâmbata:</strong> 10:00 - 14:00</p>
                    </div>
                    <p className="text-xs text-muted pt-2 border-t border-border">
                      *Te rugam sa anun?i cu 24h înainte pentru a pregati comanda
                    </p>
                  </div>
                </div>
              </div>

              {/* Urmarire Comanda */}
              <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-xl font-bold text-ui mb-2">Urmare?te-?i Comanda</h3>
                <p className="text-muted mb-6">
                  Prime?ti AWB automat prin email ?i SMS. Po?i urmari coletul în timp real.
                </p>
                <Link
                  href="/urmareste-comanda"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Verifica Status Comanda
                </Link>
              </div>

              {/* Contact */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-ui mb-3">Ai întrebari despre livrare?</h3>
                <p className="text-muted mb-6">
                  Echipa noastra este gata sa te ajute cu orice detalii despre transport ?i livrare.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="tel:+40750473111"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
                  >
                    ?? 0750 473 111
                  </a>
                  <a
                    href="mailto:contact@prynt.ro"
                    className="inline-flex items-center gap-2 bg-surface hover:bg-bg border border-border text-ui font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    ?? contact@prynt.ro
                  </a>
                </div>
              </div>

            </div>
        </div>
      </div>
    </main>
  );
}
