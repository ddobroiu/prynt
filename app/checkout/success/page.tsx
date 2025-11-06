export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Pentru "ramburs", nu avem session_id și afișăm un mesaj generic de succes.
export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId =
    (Array.isArray(params?.session_id) ? params?.session_id?.[0] : params?.session_id) || null;

  const paid = Boolean(sessionId);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">
          {paid ? "Plată confirmată" : "Comandă înregistrată"}
        </h1>
        <p className="mt-4 text-white/80">
          {paid
            ? "Îți mulțumim! Comanda ta a fost achitată și este în curs de procesare."
            : "Îți mulțumim! Comanda ta a fost înregistrată. Vei primi detalii pe email."}
        </p>
        {sessionId && (
          <p className="mt-2 text-white/60 text-sm">
            ID plată: <span className="font-mono">{sessionId}</span>
          </p>
        )}
      </div>
    </main>
  );
}