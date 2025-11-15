"use client";

import { useState } from "react";
import { Session } from "next-auth";

type UserDetailsFormProps = {
  session: Session;
};

export default function UserDetailsForm({ session }: UserDetailsFormProps) {
  const [name, setName] = useState(session.user?.name || "");
  const [email, setEmail] = useState(session.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/account/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "A apărut o eroare.");
      }

      setSuccess("Detaliile au fost actualizate cu succes!");
      // Optional: update session client-side if needed, or trigger a session reload
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nume
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Adresă de e-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          required
        />
      </div>
      
      {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Se salvează..." : "Salvează modificările"}
        </button>
      </div>
    </form>
  );
}
