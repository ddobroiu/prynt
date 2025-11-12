
"use client";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    // Here you would send the form data to an API endpoint
  }

  return (
  <main className="min-h-screen bg-surface text-ui flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-ui">Contactează echipa Prynt.ro</h1>
          <p className="text-xl text-muted mb-6">
            Suntem aici pentru orice întrebare, ofertă sau colaborare. Răspundem rapid pe toate canalele!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
          <div className="rounded-xl card-bg border border-[--border] p-6 flex flex-col items-center shadow">
            <svg className="w-8 h-8 mb-2 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 01-8 0m8 0a4 4 0 01-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
            <span className="font-semibold text-ui mb-1">Email</span>
            <a href="mailto:contact@prynt.ro" className="text-primary underline">contact@prynt.ro</a>
          </div>
          <div className="rounded-xl card-bg border border-[--border] p-6 flex flex-col items-center shadow">
            <svg className="w-8 h-8 mb-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.72 11.06a11.05 11.05 0 01-4.72-4.72l1.06-1.06a1 1 0 00-1.41-1.41l-2.12 2.12a1 1 0 000 1.41l.71.71a16.06 16.06 0 006.36 6.36l.71.71a1 1 0 001.41 0l2.12-2.12a1 1 0 00-1.41-1.41l-1.06 1.06z" /></svg>
            <span className="font-semibold text-ui mb-1">WhatsApp</span>
            <a href="https://wa.me/40750473111" className="text-green-500 underline font-semibold">0750 473 111</a>
          </div>
          <div className="rounded-xl card-bg border border-[--border] p-6 flex flex-col items-center shadow">
            <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h2.09a2 2 0 012 1.72c.13 1.13.37 2.24.72 3.32a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.36 6.36l1.27-1.27a2 2 0 012.11-.45c1.08.35 2.19.59 3.32.72A2 2 0 0122 16.92z" /></svg>
            <span className="font-semibold text-ui mb-1">Telefon</span>
            <a href="tel:0750473111" className="text-blue-500 underline font-semibold">0750 473 111</a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full flex flex-col items-center pb-16 px-4">
        <div className="max-w-xl w-full rounded-xl card-bg p-8 shadow border border-[--border]">
          <h2 className="text-2xl font-bold mb-4 text-ui text-center">Trimite-ne un mesaj</h2>
          {sent ? (
            <div className="text-green-600 text-center font-semibold py-8">
              Mulțumim! Mesajul tău a fost trimis. Revenim cât mai curând.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-ui font-medium mb-1">Nume</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[--border] bg-surface px-4 py-2 text-ui focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-ui font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[--border] bg-surface px-4 py-2 text-ui focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-ui font-medium mb-1">Mesaj</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[--border] bg-surface px-4 py-2 text-ui focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
              >Trimite mesajul</button>
            </form>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">Înapoi la prima pagină</Link>
        </div>
      </section>
    </main>
  );
}
