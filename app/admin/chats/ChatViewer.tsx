'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: string; 
};

type User = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

type Conversation = {
  id: string;
  source: string;
  identifier: string;
  hasError: boolean;
  lastMessageAt: string; 
  messages: Message[];
  user: User | null;
};

export default function ChatViewer({ conversations: initialConversations }: { conversations: Conversation[] }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'whatsapp' | 'web'>('all');
  
  // State pentru zona de scriere
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedConversation = conversations.find(c => c.id === selectedId);

  // Scroll automat la ultimul mesaj
  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedId, selectedConversation?.messages.length]);

  // Sincronizare când se primesc date noi de la server
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const filteredList = conversations.filter(c => {
    if (filter === 'error') return c.hasError;
    if (filter === 'whatsapp') return c.source === 'whatsapp';
    if (filter === 'web') return c.source === 'web';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ro-RO', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedId || isSending) return;

    setIsSending(true);
    try {
      // Apelăm endpoint-ul creat anterior
      const res = await fetch('/api/admin/chats/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedId,
          message: inputText
        })
      });

      if (!res.ok) throw new Error('Eroare la trimitere');

      const newMessageData = await res.json();

      // Actualizăm interfața local
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            lastMessageAt: new Date().toISOString(),
            messages: [...conv.messages, {
              ...newMessageData,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return conv;
      }));

      setInputText("");
      router.refresh(); // Refresh la server components pentru consistență

    } catch (err) {
      console.error(err);
      alert("Nu s-a putut trimite mesajul.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* SIDEBAR LISTA */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50 h-[calc(100vh-64px)]">
        {/* Filtre */}
        <div className="p-3 border-b border-slate-200 flex gap-2 overflow-x-auto shrink-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border'}`}
          >
            Toate
          </button>
          <button 
            onClick={() => setFilter('error')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'error' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200'}`}
          >
            Necesită Atenție
          </button>
          <button 
            onClick={() => setFilter('whatsapp')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-200'}`}
          >
            WhatsApp
          </button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.map(conv => {
            const isWhatsapp = conv.source === 'whatsapp';
            const hasError = conv.hasError;
            const isSelected = conv.id === selectedId;

            const lastMsgContent = conv.messages.length > 0 
                ? (conv.messages[conv.messages.length - 1].content || "") 
                : "Fără mesaje";

            return (
              <div 
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-100 
                  ${isSelected ? 'bg-white border-l-4 border-l-slate-800 shadow-sm' : 'border-l-4 border-l-transparent'}
                  ${hasError ? 'bg-red-50/50' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isWhatsapp ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {isWhatsapp ? 'WhatsApp' : 'Web'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(conv.lastMessageAt)}
                  </span>
                </div>

                <div className="font-semibold text-slate-800 truncate">
                  {conv.user?.name || conv.identifier}
                </div>
                
                <div className="text-xs text-slate-500 truncate mb-1">
                  {lastMsgContent.substring(0, 40)}...
                </div>

                {hasError && (
                  <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                    A CERUT CONTACT
                  </span>
                )}
              </div>
            );
          })}
          {filteredList.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Nu am găsit conversații.
            </div>
          )}
        </div>
      </div>

      {/* ZONA DE CHAT (DREAPTA) */}
      <div className="w-2/3 flex flex-col bg-white h-[calc(100vh-64px)]">
        {selectedConversation ? (
          <>
            {/* Header Chat */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <h2 className="font-bold text-lg text-slate-800">
                  {selectedConversation.user?.name || selectedConversation.identifier}
                </h2>
                <div className="text-sm text-slate-500 flex gap-3">
                  <span>{selectedConversation.source === 'whatsapp' ? 'Telefon: ' : 'ID Sesiune: '} {selectedConversation.identifier}</span>
                  {selectedConversation.user?.email && <span>| Email: {selectedConversation.user.email}</span>}
                </div>
              </div>
              {selectedConversation.hasError && (
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs border border-red-100">
                  ⚠️ Conversație Eșuată
                </div>
              )}
            </div>

            {/* Mesaje */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {selectedConversation.messages.map((msg) => {
                const isAdmin = msg.role === 'admin';
                const isBot = msg.role === 'assistant';
                const isSystem = msg.role === 'system' || msg.role === 'tool';
                
                if (isSystem) return null; 

                // Adminul (tu) și Botul apar în stânga, Userul în dreapta
                const alignLeft = isAdmin || isBot;

                return (
                  <div key={msg.id} className={`flex ${alignLeft ? 'justify-start' : 'justify-end'}`}>
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isAdmin 
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tl-none' // Stil Operator Uman
                          : isBot 
                            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' // Stil Bot
                            : 'bg-slate-800 text-white rounded-tr-none' // Stil User
                      }`}
                    >
                      {isAdmin && (
                        <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wider">
                          Operator Uman
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                      <div className="text-[10px] mt-1 text-right text-slate-400">
                        {formatDate(msg.createdAt).split(',')[1]}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* ZONA DE INPUT (Footer) - Aici scrii tu */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrie un mesaj... (Enter pentru a trimite)"
                  className="flex-1 min-h-[44px] max-h-[120px] p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="h-[44px] px-6 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? '...' : 'Trimite'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <p>Selectează o conversație din stânga pentru a vedea detaliile.</p>
          </div>
        )}
      </div>
    </div>
  );
}