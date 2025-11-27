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
  
  // Stări pentru UI
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [filterSource, setFilterSource] = useState<'all' | 'whatsapp' | 'web'>('all');

  // Stări pentru Input
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedConversation = conversations.find(c => c.id === selectedId);

  // ------------------------------------------------------------------
  // 1. ACTUALIZARE AUTOMATĂ (POLLING)
  // ------------------------------------------------------------------
  useEffect(() => {
    // La fiecare 4 secunde, reîmprospătăm datele de la server
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(interval);
  }, [router]);

  // Sincronizare cu datele noi venite de la server
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // Scroll automat la ultimul mesaj
  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setTagInput(selectedConversation.customTag || "");
    }
  }, [selectedId, selectedConversation?.messages.length]);

  // ------------------------------------------------------------------
  // LOGICA DE FILTRARE
  // ------------------------------------------------------------------
  const filteredList = conversations.filter(c => {
    const convStatus = c.status || 'active';
    if (convStatus !== activeTab) return false;
    if (filterSource === 'whatsapp' && c.source !== 'whatsapp') return false;
    if (filterSource === 'web' && c.source !== 'web') return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ro-RO', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // ------------------------------------------------------------------
  // ACȚIUNI API
  // ------------------------------------------------------------------
  const updateConversation = async (updates: any) => {
    if (!selectedId) return;
    try {
      if (updates.aiPaused !== undefined) setIsToggling(true);
      
      const res = await fetch('/api/admin/chats/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, updates })
      });
      if (!res.ok) throw new Error("Eroare update");
      
      setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, ...updates } : c));
      router.refresh();
    } catch (e) {
      console.error(e);
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
    // CONTAINER PRINCIPAL: Fixam inaltimea si ascundem overflow-ul general
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      
      {/* -------------------- SIDEBAR (STÂNGA) -------------------- */}
      <div className="w-1/3 border-r border-slate-300 flex flex-col bg-white h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        {/* TABS (FIXED TOP) - Folosim shrink-0 ca sa nu se micșoreze */}
        <div className="flex border-b border-slate-200 shrink-0 bg-white z-10">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors
              ${activeTab === 'active' ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
            `}
          >
            📥 Inbox ({conversations.filter(c => (!c.status || c.status === 'active')).length})
          </button>
          <button 
            onClick={() => setActiveTab('archived')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors
              ${activeTab === 'archived' ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
            `}
          >
            ✅ Finalizate
          </button>
        </div>

        {/* FILTRE SURSĂ (FIXED TOP) */}
        <div className="p-2 border-b border-slate-200 flex gap-2 justify-center bg-slate-50 shrink-0">
          <button onClick={() => setFilterSource('all')} className={`px-3 py-1 text-xs rounded-md border transition-all ${filterSource === 'all' ? 'bg-white border-slate-300 text-slate-900 shadow-sm font-semibold' : 'border-transparent text-slate-500 hover:bg-white'}`}>Toate</button>
          <button onClick={() => setFilterSource('whatsapp')} className={`px-3 py-1 text-xs rounded-md border transition-all ${filterSource === 'whatsapp' ? 'bg-green-50 border-green-200 text-green-700 font-semibold' : 'border-transparent text-slate-500 hover:bg-white'}`}>WhatsApp</button>
          <button onClick={() => setFilterSource('web')} className={`px-3 py-1 text-xs rounded-md border transition-all ${filterSource === 'web' ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'border-transparent text-slate-500 hover:bg-white'}`}>Web</button>
        </div>

        {/* LISTA DE CONVERSAȚII (SCROLLABLE AREA) */}
        {/* Doar zona asta face scroll, taburile raman sus */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredList.length === 0 ? (
             <div className="p-10 text-center text-slate-400 text-sm flex flex-col items-center">
                <span className="text-2xl mb-2 opacity-20">📭</span>
                Nu sunt conversații aici.
             </div>
          ) : (
             filteredList.map(conv => {
                const isWhatsapp = conv.source === 'whatsapp';
                const isSelected = conv.id === selectedId;
                const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
                const lastMsgContent = lastMsg?.content || "Fără mesaje";

                return (
                  <div 
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 relative group
                      ${isSelected ? 'bg-blue-50/60 border-l-4 border-l-slate-800' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isWhatsapp ? 'bg-green-500' : 'bg-blue-500'}`} />
                        {conv.aiPaused && <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wide">Manual</span>}
                        {conv.customTag && <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded border border-purple-200 font-bold truncate max-w-[80px]">{conv.customTag}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(conv.lastMessageAt)}</span>
                    </div>

                    <div className="font-bold text-slate-800 truncate text-sm mb-1">
                      {conv.user?.name || conv.identifier}
                    </div>
                    
                    <div className={`text-xs truncate ${lastMsg?.role === 'user' ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      <span className="opacity-50 mr-1">{lastMsg?.role === 'user' ? '👤' : lastMsg?.role === 'admin' ? '👮' : '🤖'}</span>
                      {lastMsgContent.substring(0, 50)}...
                    </div>
                  </div>
                );
             })
          )}
        </div>
      </div>

      {/* -------------------- ZONA DE CHAT (DREAPTA) -------------------- */}
      <div className="w-2/3 flex flex-col bg-white h-full relative">
        {selectedConversation ? (
          <>
            {/* HEADER CHAT (FIXED TOP) */}
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
               <div>
                  <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {selectedConversation.user?.name || selectedConversation.identifier}
                    {selectedConversation.source === 'whatsapp' && <span className="bg-green-100 text-green-800 text-[10px] px-1.5 rounded font-bold">WA</span>}
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    ID: {selectedConversation.identifier} {selectedConversation.user?.email ? `• ${selectedConversation.user.email}` : ''}
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  {/* Etichetă Editabilă */}
                  <input 
                    type="text" 
                    className="text-xs border border-slate-200 bg-slate-50 rounded px-2 py-1.5 w-32 focus:w-48 transition-all focus:border-slate-400 focus:outline-none focus:bg-white" 
                    placeholder="+ Adaugă etichetă" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    onBlur={handleTagBlur} 
                  />
                  
                  {/* Buton Arhivare/Dezarhivare */}
                  {selectedConversation.status === 'active' ? (
                    <button 
                      onClick={() => updateConversation({ status: 'archived' })}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="text-sm">✓</span> Finalizează
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateConversation({ status: 'active' })}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="text-sm">↩</span> Redeschide
                    </button>
                  )}
               </div>
            </div>

            {/* MESAJE (SCROLLABLE AREA) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth">
              {selectedConversation.messages.map((msg) => {
                if (msg.role === 'system' || msg.role === 'tool') return null;
                const isAdmin = msg.role === 'admin';
                const isBot = msg.role === 'assistant';
                const isUser = msg.role === 'user';
                
                const alignLeft = !isUser; // Admin și Bot la stânga

                return (
                  <div key={msg.id} className={`flex ${alignLeft ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm relative group
                        ${isAdmin 
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tl-none' 
                          : isBot 
                            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                            : 'bg-slate-900 text-white rounded-tr-none'
                        }`}
                    >
                      {isAdmin && <div className="text-[9px] font-bold text-blue-600 mb-1 uppercase tracking-wider flex items-center gap-1">👮 Operator Uman</div>}
                      {isBot && <div className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1">🤖 Robot</div>}
                      
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      
                      <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-slate-400' : 'text-slate-400'} opacity-70`}>
                        {formatDate(msg.createdAt).split(',')[1]}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* FOOTER INPUT (FIXED BOTTOM) */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
              
              {/* STATUS BAR & COMUTATOR ROBOT */}
              <div className="flex items-center justify-between mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mod Discuție:</span>
                    
                    <button
                        onClick={() => updateConversation({ aiPaused: !selectedConversation.aiPaused })}
                        disabled={isToggling}
                        className={`
                            px-3 py-1 rounded text-xs font-bold border flex items-center gap-2 transition-all shadow-sm
                            ${selectedConversation.aiPaused 
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            }
                        `}
                    >
                        {isToggling ? (
                            <span className="animate-spin">⌛</span>
                        ) : selectedConversation.aiPaused ? (
                            <>🔴 MANUAL (Robot Oprit)</>
                        ) : (
                            <>🟢 AUTO (Robot Pornit)</>
                        )}
                    </button>
                 </div>

                 {selectedConversation.aiPaused && (
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 animate-pulse">
                       ⚠️ Doar tu răspunzi.
                    </span>
                 )}
              </div>

              {/* INPUT ZONA */}
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 min-h-[48px] max-h-[120px] p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 bg-white placeholder:text-slate-400 transition-all shadow-sm"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="h-[48px] px-6 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center min-w-[100px]"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Trimite'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 bg-slate-50/30">
            <svg className="w-24 h-24 mb-6 opacity-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-slate-400">Selectează o conversație din stânga.</p>
          </div>
        )}
      </div>
    </div>
  );
}