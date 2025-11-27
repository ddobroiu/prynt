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
  aiPaused: boolean;
  status: string;
  customTag: string | null;
  lastMessageAt: string; 
  messages: Message[];
  user: User | null;
};

export default function ChatViewer({ conversations: initialConversations }: { conversations: Conversation[] }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Tab-uri și Filtre
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [filterSource, setFilterSource] = useState<'all' | 'whatsapp' | 'web'>('all');

  // Input și Stări
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedConversation = conversations.find(c => c.id === selectedId);

  // 1. ACTUALIZARE AUTOMATĂ (Polling la 4 secunde)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  // Sincronizare date server
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // Scroll la ultimul mesaj
  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setTagInput(selectedConversation.customTag || "");
    }
  }, [selectedId, selectedConversation?.messages.length]);

  // LOGICA DE FILTRARE
  const filteredList = conversations.filter(c => {
    const convStatus = c.status || 'active';
    // Tab curent (Inbox vs Finalizate)
    if (convStatus !== activeTab) return false;
    // Sursă (Whatsapp vs Web)
    if (filterSource === 'whatsapp' && c.source !== 'whatsapp') return false;
    if (filterSource === 'web' && c.source !== 'web') return false;
    return true;
  });

  const activeCount = conversations.filter(c => (!c.status || c.status === 'active')).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ro-RO', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // --- ACTIONS ---

  const updateConversation = async (updates: any) => {
    if (!selectedId) return;
    try {
      if (updates.aiPaused !== undefined || updates.status !== undefined) setIsToggling(true);
      
      const res = await fetch('/api/admin/chats/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, updates })
      });
      if (!res.ok) throw new Error("Eroare update");
      
      // Update local rapid
      setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, ...updates } : c));
      
      // Dacă finalizăm, scoatem selecția
      if (updates.status === 'archived') setSelectedId(null);
      
      router.refresh();
    } catch (e) {
      alert("Eroare la actualizare.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedId || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/admin/chats/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, message: inputText })
      });
      if (!res.ok) throw new Error('Eroare la trimitere');
      const newMessageData = await res.json();

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            lastMessageAt: new Date().toISOString(),
            messages: [...conv.messages, { ...newMessageData, createdAt: new Date().toISOString() }]
          };
        }
        return conv;
      }));
      setInputText("");
      router.refresh();
    } catch (err) {
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

  const handleTagBlur = () => {
    if (selectedConversation && tagInput !== selectedConversation.customTag) {
      updateConversation({ customTag: tagInput });
    }
  };

  return (
    // LAYOUT FIX: Înălțimea calculată exact cât ecranul minus header-ul site-ului (~64px)
    <div className="flex h-[calc(100vh-64px)] w-full bg-slate-100 overflow-hidden border-t border-slate-200">
      
      {/* ==================== SIDEBAR (Lista Conversații) ==================== */}
      <div className="w-1/3 min-w-[300px] border-r border-slate-200 flex flex-col bg-white h-full">
        {/* HEADER SIDEBAR (Fix, rămâne vizibil) */}
        <div className="shrink-0 bg-white border-b border-slate-200 z-40 sticky top-0">
          {/* Tab-uri Inbox / Finalizate */}
          <div className="flex">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex justify-center items-center gap-2
                ${activeTab === 'active' ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-400 hover:bg-slate-50'}
              `}
            >
              📥 Inbox 
              {activeCount > 0 && <span className="bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-full">{activeCount}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors
                ${activeTab === 'archived' ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-400 hover:bg-slate-50'}
              `}
            >
              ✅ Finalizate
            </button>
          </div>

          {/* Filtre Sursă */}
          <div className="p-2 flex gap-2 justify-center bg-slate-50">
            <button onClick={() => setFilterSource('all')} className={`px-3 py-1 text-xs rounded border ${filterSource === 'all' ? 'bg-white border-slate-400 font-bold' : 'border-transparent text-slate-500'}`}>Toate</button>
            <button onClick={() => setFilterSource('whatsapp')} className={`px-3 py-1 text-xs rounded border ${filterSource === 'whatsapp' ? 'bg-green-100 border-green-300 text-green-800 font-bold' : 'border-transparent text-slate-500'}`}>WhatsApp</button>
            <button onClick={() => setFilterSource('web')} className={`px-3 py-1 text-xs rounded border ${filterSource === 'web' ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold' : 'border-transparent text-slate-500'}`}>Web</button>
          </div>
        </div>

        {/* LISTA (Scrollabilă) */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs flex flex-col items-center">
              <span className="text-3xl mb-2 opacity-30">📭</span>
              <p>Nicio conversație aici.</p>
            </div>
          ) : (
            filteredList.map(conv => {
                const isWhatsapp = conv.source === 'whatsapp';
                const isSelected = conv.id === selectedId;
                const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

                return (
                  <div 
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50
                      ${isSelected ? 'bg-blue-50 border-l-4 border-l-slate-800' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isWhatsapp ? 'bg-green-500' : 'bg-blue-500'}`} />
                        {conv.aiPaused && <span className="bg-red-100 text-red-700 text-[9px] px-1.5 rounded border border-red-200 font-bold">MANUAL</span>}
                        {conv.customTag && <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 rounded border border-purple-200 font-bold truncate max-w-[80px]">{conv.customTag}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(conv.lastMessageAt)}</span>
                    </div>

                    <div className="font-bold text-slate-800 truncate text-sm">
                      {conv.user?.name || conv.identifier}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-1 opacity-80">
                      {lastMsg?.content ? lastMsg.content.substring(0, 40) + "..." : "..."}
                    </div>
                  </div>
                );
             })
          )}
        </div>
      </div>

      {/* ==================== ZONA DE CHAT (Dreapta) ==================== */}
      <div className="w-2/3 flex flex-col h-full bg-white relative">
        {selectedConversation ? (
          <>
            {/* HEADER CHAT (Fix) */}
            <div className="shrink-0 bg-white border-b border-slate-200 p-3 flex justify-between items-center z-10 shadow-sm">
               <div>
                  <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {selectedConversation.user?.name || selectedConversation.identifier}
                  </h2>
                  <div className="text-xs text-slate-500 flex gap-2">
                    <span className="uppercase font-bold text-[10px] bg-slate-100 px-1 rounded">{selectedConversation.source}</span>
                    <span>{selectedConversation.identifier}</span>
                  </div>
               </div>
               
               <input 
                 type="text" 
                 className="text-xs border border-slate-300 rounded px-2 py-1 w-32 focus:w-48 transition-all focus:border-blue-500 focus:outline-none" 
                 placeholder="+ Etichetă (ex: Urgent)" 
                 value={tagInput} 
                 onChange={(e) => setTagInput(e.target.value)} 
                 onBlur={handleTagBlur} 
               />
            </div>

            {/* MESAJE (Scrollabil) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 scroll-smooth">
              {selectedConversation.messages.map((msg) => {
                if (msg.role === 'system' || msg.role === 'tool') return null;
                const isAdmin = msg.role === 'admin';
                const isBot = msg.role === 'assistant';
                const isUser = msg.role === 'user';
                const alignLeft = !isUser; 

                return (
                  <div key={msg.id} className={`flex ${alignLeft ? 'justify-start' : 'justify-end'}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm relative group
                        ${isAdmin 
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tl-none' 
                          : isBot 
                            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                            : 'bg-slate-900 text-white rounded-tr-none'
                        }`}
                    >
                      {isAdmin && <div className="text-[9px] font-bold text-blue-600 mb-0.5 uppercase flex items-center gap-1">👮 Operator</div>}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className="text-[9px] mt-1 text-right opacity-50">
                        {formatDate(msg.createdAt).split(',')[1]}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* FOOTER (Fix) - Controale + Input */}
            <div className="shrink-0 bg-white border-t border-slate-200 p-4 shadow-lg z-20">
              
              {/* BARA DE CONTROL */}
              <div className="flex items-center justify-between mb-2 bg-slate-50 p-2 rounded border border-slate-100">
                 {/* 1. Comutator Robot */}
                 <button
                    onClick={() => updateConversation({ aiPaused: !selectedConversation.aiPaused })}
                    disabled={isToggling}
                    className={`
                        px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-2 transition-all
                        ${selectedConversation.aiPaused 
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }
                    `}
                 >
                    {selectedConversation.aiPaused ? '🔴 MANUAL (Robot Oprit)' : '🟢 AUTO (Robot Pornit)'}
                 </button>

                 {/* 2. Buton Finalizare */}
                 {selectedConversation.status === 'active' ? (
                    <button 
                      onClick={() => updateConversation({ status: 'archived' })}
                      className="bg-white border border-slate-300 text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1"
                    >
                      ✅ Finalizează
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateConversation({ status: 'active' })}
                      className="bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1"
                    >
                      ↩️ Redeschide
                    </button>
                  )}
              </div>

              {/* INPUT MESAJ */}
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrie un mesaj... (Enter pentru a trimite)"
                  className="flex-1 min-h-[44px] max-h-[120px] p-2.5 border border-slate-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="h-[44px] px-6 bg-slate-900 text-white rounded text-sm font-bold hover:bg-slate-700 disabled:opacity-50 transition-all shadow-md"
                >
                  {isSending ? '...' : 'Trimite'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50">
            <p className="font-medium">Selectează o conversație.</p>
          </div>
        )}
      </div>
    </div>
  );
}