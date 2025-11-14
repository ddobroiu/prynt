import { getAuthSession } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import { headers } from "next/headers";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function AccountPage() {
  const session = await getAuthSession();
  // Citește query param welcome=1 pentru banner succes
  let showWelcome = false;
  try {
    const h = headers();
    const url = h.get('x-url') || h.get('referer');
    // fallback: try request url via NEXT_URL (some deployments)
    const u = url || process.env.NEXT_PUBLIC_SITE_URL;
    if (u) {
      const parsed = new URL(u);
      if (parsed.searchParams.get('welcome') === '1') showWelcome = true;
    }
  } catch {}
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Cont</h1>
        <p className="text-muted">Nu ești autentificat(ă). <a className="text-indigo-400 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
      <h1 className="text-2xl font-bold">Bun venit, {session.user.name || session.user.email}</h1>
      {showWelcome && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
          Cont creat cu succes. Te-ai autentificat automat.
        </div>
      )}
      <div className="rounded-md border border-[--border] p-4">
        <div className="text-sm text-muted">Email</div>
        <div className="font-medium">{session.user.email}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a href="/account/orders" className="rounded-md border border-[--border] p-4 hover:bg-white/5 transition">
          <div className="font-semibold">Comenzile mele</div>
          <div className="text-sm text-muted">Vezi istoricul comenzilor</div>
        </a>
        {/* Placeholder pentru adrese / setări cont */}
        <a href="/checkout" className="rounded-md border border-[--border] p-4 hover:bg-white/5 transition">
          <div className="font-semibold">Cumpără din nou</div>
          <div className="text-sm text-muted">Revino la coș și finalizează</div>
        </a>
      </div>

      <SignOutButton />
      <ChangePasswordForm />
    </div>
  );
}
