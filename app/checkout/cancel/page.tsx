export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Plata a fost anulată</h1>
        <p className="text-white/70">Poți încerca din nou sau modifica coșul înainte de plată.</p>
        <a href="/checkout" className="mt-6 inline-block px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90">
          Înapoi la finalizare
        </a>
      </div>
    </main>
  );
}
