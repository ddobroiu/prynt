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

  // 1. ACTUALIZARE AUTOMATĂ (Polling la 4 secunde)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setTagInput(selectedConversation.customTag || "");
    }
  }, [selectedId, selectedConversation?.messages.length]);

  // LOGICA DE FILTRARE
  const filteredList = conversations.filter(c => {
    const convStatus = c.status || 'active';
    if (convStatus !== activeTab) return false;
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
      
      setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, ...updates } : c));
      
      // Dacă am arhivat-o, deselectăm (că dispare din listă)
      if (updates.status === 'archived') {
          setSelectedId(null);
      }
      
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      
      {/* --- SIDEBAR LISTA --- */}
      <div className="w-1/3 border-r border-slate-300 flex flex-col bg-white h-full shadow-lg z-10">
        
        {/* TABS */}
        <div className="flex border-b border-slate-200 shrink-0 bg-white">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex justify-center items-center gap-2
              ${activeTab === 'active' ? 'border-slate-800 text-slate-800 bg-slate-50' : 'border-transparent text-slate-400 hover:bg-slate-50'}
            `}
          >
            📥 Inbox <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full">{activeCount}</span>
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

        {/* FILTRE SURSA */}
        <div className="p-2 border-b border-slate-200 flex gap-2 justify-center bg-slate-50 shrink-0">
          <button onClick={() => setFilterSource('all')} className={`px-3 py-1 text-xs rounded-md border ${filterSource === 'all' ? 'bg-white border-slate-300 text-slate-900 font-bold' : 'border-transparent text-slate-500'}`}>Toate</button>
          <button onClick={() => setFilterSource('whatsapp')} className={`px-3 py-1 text-xs rounded-md border ${filterSource === 'whatsapp' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'border-transparent text-slate-500'}`}>WhatsApp</button>
        </div>

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredList.length === 0 ? (
             <div className="p-10 text-center text-slate-400 text-sm flex flex-col items-center mt-10">
                <span className="text-4xl mb-2 opacity-20">📭</span>
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
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50
                      ${isSelected ? 'bg-blue-50/60 border-l-4 border-l-slate-800' : 'border-l-4 border-l-transparent'}
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
                      {lastMsg?.content ? lastMsg.content.substring(0, 40) + "..." : "Fără mesaje"}
                    </div>
                  </div>
                );
             })
          )}
        </div>
      </div>

      {/* --- ZONA CHAT --- */}
      <div className="w-2/3 flex flex-col bg-white h-full relative">
        {selectedConversation ? (
          <>
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
               <div>
                  <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {selectedConversation.user?.name || selectedConversation.identifier}
                  </h2>
                  <div className="text-xs text-slate-500">
                    {selectedConversation.source} | {selectedConversation.identifier}
                  </div>
               </div>
               
               <input 
                 type="text" 
                 className="text-xs border border-slate-200 bg-slate-50 rounded px-3 py-1.5 w-40 focus:w-56 transition-all focus:border-slate-400 focus:outline-none" 
                 placeholder="+ Adaugă Etichetă (ex: Urgent)" 
                 value={tagInput} 
                 onChange={(e) => setTagInput(e.target.value)} 
                 onBlur={handleTagBlur} 
               />
            </div>

            {/* MESAJE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {selectedConversation.messages.map((msg) => {
                if (msg.role === 'system' || msg.role === 'tool') return null;
                const isAdmin = msg.role === 'admin';
                const isBot = msg.role === 'assistant';
                const isUser = msg.role === 'user';
                const alignLeft = !isUser; 

                return (
                  <div key={msg.id} className={`flex ${alignLeft ? 'justify-start' : 'justify-end'}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm relative
                        ${isAdmin 
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tl-none' 
                          : isBot 
                            ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                            : 'bg-slate-900 text-white rounded-tr-none'
                        }`}
                    >
                      {isAdmin && <div className="text-[9px] font-bold text-blue-600 mb-1 uppercase">Operator</div>}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className="text-[10px] mt-1 text-right opacity-50">
                        {formatDate(msg.createdAt).split(',')[1]}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* FOOTER - ACTIUNI + INPUT */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
              
              {/* BARA DE CONTROL (Robot & Status) */}
              <div className="flex items-center justify-between mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                 
                 {/* 1. CONTROL ROBOT */}
                 <div className="flex items-center gap-2">
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
                 </div>

                 {/* 2. BUTON FINALIZARE (AICI ESTE!) */}
                 {selectedConversation.status === 'active' ? (
                    <button 
                      onClick={() => updateConversation({ status: 'archived' })}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300 px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>✅</span> Finalizează Discuția
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateConversation({ status: 'active' })}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>↩️</span> Redeschide
                    </button>
                  )}
              </div>

              {/* INPUT ZONA */}
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 min-h-[48px] max-h-[120px] p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 bg-white placeholder:text-slate-400"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="h-[48px] px-6 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md min-w-[100px]"
                >
                  {isSending ? '...' : 'Trimite'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 bg-slate-50/30">
            <p className="font-medium text-slate-400">Selectează o conversație din stânga.</p>
          </div>
        )}
      </div>
    </div>
  );
}