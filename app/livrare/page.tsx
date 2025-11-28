import React from "react";
import { Metadata } from "next";
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Livrare & Transport | Prynt.ro",
  description: "Informații despre livrare: costuri, zone de livrare, timpi estimați și opțiuni de ridicare. Livrăm în toată România.",
  alternates: {
    canonical: "/livrare"
  }
};

export default function LivrarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Truck className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Livrare & Transport
            </h1>
            <p className="text-xl text-blue-100">
              Livrăm în toată România comenzile tale de materiale publicitare
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Zone de livrare */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Zone de Livrare
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Livrare Națională
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Livrăm în toate județele României prin curier rapid (Fan Courier, DPD, Sameday).
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>București & Ilfov:</strong> 1-2 zile lucrătoare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Orașe mari:</strong> 2-3 zile lucrătoare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>Mediu rural:</strong> 3-5 zile lucrătoare</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-600" />
                  Ridicare din Depozit
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Poți ridica comanda personal din depozitul nostru, fără costuri suplimentare.
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Program ridicări:
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Luni - Vineri: 09:00 - 18:00
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Sâmbătă: 10:00 - 14:00
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    *Te rugăm să anunți cu 24h înainte pentru a pregăti comanda
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Costuri livrare */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Costuri de Transport
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Valoare Comandă
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      București & Ilfov
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Restul Țării
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 text-slate-900 dark:text-white">
                      Sub 200 RON
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      25 RON
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      35 RON
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-900 dark:text-white">
                      200 - 500 RON
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      20 RON
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      30 RON
                    </td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <td className="px-6 py-4 font-semibold text-green-700 dark:text-green-400">
                      Peste 500 RON
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-700 dark:text-green-400">
                      GRATUIT
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-700 dark:text-green-400">
                      GRATUIT
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white mb-2">
                  Note importante:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Comenzile mari (bannere peste 3m, cantități mari) pot avea costuri suplimentare</li>
                  <li>Livrările în zone greu accesibile se vor taxa diferit (se va comunica înainte)</li>
                  <li>Pentru livrări urgente (sub 24h) contactează-ne telefonic</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Timpi de livrare */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Timpi Estimați de Livrare
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-6 py-3">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  Producție + Livrare
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  Timpul total include producția materialelor + transportul:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li><strong>Bannere & Autocolante:</strong> 1-2 zile producție + 1-3 zile transport</li>
                  <li><strong>Pliante & Flayere:</strong> 2-3 zile producție + 1-3 zile transport</li>
                  <li><strong>Canvas & Tablouri:</strong> 2-4 zile producție + 1-3 zile transport</li>
                  <li><strong>Materiale Rigide:</strong> 3-5 zile producție + 1-3 zile transport</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 pl-6 py-3">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  🚀 Opțiune Express (cu cost adițional)
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Pentru comenzi urgente oferim producție accelerată (24-48h) + livrare urgentă. 
                  Contactează-ne la <strong>0750 473 111</strong> pentru detalii și cost.
                </p>
              </div>
            </div>
          </section>

          {/* Urmărire comandă */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Urmărește-ți Comanda
              </h2>
              <p className="text-indigo-100 mb-6">
                Primești AWB automat prin email și SMS. Poți urmări coletul în timp real.
              </p>
              <a
                href="/urmareste-comanda"
                className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Verifică Status Comandă
              </a>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ai întrebări despre livrare?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Echipa noastră este gata să te ajute cu orice detalii despre transport și livrare.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+40750473111"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📞 0750 473 111
              </a>
              <a
                href="mailto:contact@prynt.ro"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ✉️ contact@prynt.ro
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
