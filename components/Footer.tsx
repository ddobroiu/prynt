"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || "";
    if (!email) return;

    fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    })
      .then((r) => r.json())
      .then((res) => {
        alert(res?.message || "Verifică emailul pentru confirmare.");
        (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
      })
      .catch(() => alert("Nu am putut trimite cererea. Încearcă din nou."));
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand & Socials */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} Logo`}
                width={48}
                height={48}
                className="rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {siteConfig.socialLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                >
                  <link.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Nav */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {siteConfig.footerNav.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{section.title}</h3>
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">Abonează-te la Newsletter</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fii la curent cu cele mai noi oferte și produse.
            </p>
            <form className="mt-4 flex flex-col sm:flex-row gap-2" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="adresa@email.com"
                required
                className="flex-1"
                aria-label="Adresa de email pentru newsletter"
              />
              <Button type="submit" variant="default">
                Abonează-mă
              </Button>
            </form>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Primești un email de confirmare (double opt-in).
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="noopener noreferrer"
              title="Soluționarea Alternativă a Litigiilor – ANPC"
            >
              <Image
                src="/250x50_icon_ANPC-SAL.webp"
                alt="ANPC – SAL"
                width={125}
                height={25}
                className="h-auto w-auto object-contain"
              />
            </a>
            <a
              href="https://consumer-redress.ec.europa.eu/index_ro"
              target="_blank"
              rel="noopener noreferrer"
              title="Platforma europeană SOL – Soluționarea Online a Litigiilor"
            >
              <Image
                src="/250x50_icon_ANPC-SOL.webp"
                alt="UE – Platformă SOL"
                width={125}
                height={25}
                className="h-auto w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}