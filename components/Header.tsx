import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Prynt.ro Logo"
            width={60}  // mărim logo-ul
            height={60}
            priority
          />
        </Link>

        {/* MENIU */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/banner" className="hover:text-white">Banner</Link>
          <Link href="/flayer" className="hover:text-white">Flayer</Link>
          <Link href="/canvas" className="hover:text-white">Canvas</Link>
          <Link href="/autocolante" className="hover:text-white">Autocolante</Link>
          <Link href="/materiale-rigide" className="hover:text-white">Materiale rigide</Link>
        </nav>

        {/* COS / BUTON DREAPTA */}
        <div className="flex items-center gap-3">
          <a
            href="/checkout"
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90 text-sm"
          >
            Coșul meu
          </a>
        </div>
      </div>
    </header>
  );
}
