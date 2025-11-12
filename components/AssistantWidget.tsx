'use client';

import React from 'react';

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export default function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Salut! Sunt asistentul Prynt. Spune-mi pe scurt ce ai nevoie (ex: banner exterior 3×1 m cu capse, autocolante decupate, pliante A5 etc.) și te ghidez către produsul potrivit.',
    },
  ]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', content: data.reply },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content:
            'Îmi pare rău, a apărut o problemă. Încearcă din nou sau folosește meniul pentru a alege produsul.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    'Banner exterior 300×100 cm cu capse',
    'Autocolante decupate la contur, laminare mată',
    'Pliante A5, 170 g, tri pli',
    'Afișe A2 pentru interior',
    'Tablou canvas 80×60 cm',
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Toggle button */}
      <button
        aria-label="Deschide asistentul Prynt"
        className="rounded-full bg-primary text-white shadow-lg w-12 h-12 flex items-center justify-center hover:opacity-90 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '×' : 'AI'}
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-2 w-[340px] sm:w-[380px] max-h-[60vh] overflow-hidden rounded-xl border bg-background shadow-xl">
          <div className="p-3 border-b">
            <div className="font-semibold">Asistent Prynt</div>
            <div className="text-xs text-muted-foreground">Recomandări pentru servicii de print</div>
          </div>

          <div className="p-3 space-y-3 overflow-y-auto max-h-[42vh]">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={
                    'inline-block px-3 py-2 rounded-lg whitespace-pre-wrap ' +
                    (m.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground')
                  }
                  dangerouslySetInnerHTML={{ __html: linkify(m.content) }}
                />
              </div>
            ))}

            {!loading && (
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    className="text-xs px-2 py-1 rounded-full border hover:bg-muted"
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none"
              placeholder="Scrie mesajul tău..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-primary text-white text-sm disabled:opacity-60"
              disabled={loading}
            >
              {loading ? '...' : 'Trimite'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function linkify(text: string) {
  // Very small helper to keep links clickable in assistant replies
  return text.replace(/(https?:\/\/[^\s<]+)/g, '<a class="underline" target="_blank" rel="noopener" href="$1">$1</a>');
}
