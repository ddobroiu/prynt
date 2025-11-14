import { auth, signOut } from "@/lib/auth";

export default async function AccountPage() {
  const session = await auth();
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
      <div className="rounded-md border border-[--border] p-4">
        <div className="text-sm text-muted">Email</div>
        <div className="font-medium">{session.user.email}</div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500">Delogare</button>
      </form>
    </div>
  );
}
