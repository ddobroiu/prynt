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
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [filterSource, setFilterSource] = useState<'all' | 'whatsapp' | 'web'>('all');

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isToggling, setIsToggling] = useState(false); // State pentru butonul AI
  const [tagInput, setTagInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedConversation = conversations.find(c => c.id === selectedId);

  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setTagInput(selectedConversation.customTag || "");
    }
  }, [selectedId, selectedConversation?.messages.length]);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

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
    <div className="flex h-full bg-slate-100">
      {/* SIDEBAR */}
      <div className="w-1/3 border-r border-slate-300 flex flex-col bg-white h-[calc(100vh-64px)]">
        <div className="flex border-b border-slate-200">
          <button onClick={() => setActiveTab('active')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'active' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:bg-slate-50'}`}>📥 Inbox</button>
          <button onClick={() => setActiveTab('archived')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'archived' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:bg-slate-50'}`}>✅ Finalizate</button>
        </div>
        <div className="p-2 border-b border-slate-200 flex gap-2 justify-center bg-slate-50">
          <button onClick={() => setFilterSource('all')} className={`px-3 py-1 text-xs rounded-md ${filterSource === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Toate</button>
          <button onClick={() => setFilterSource('whatsapp')} className={`px-3 py-1 text-xs rounded-md ${filterSource === 'whatsapp' ? 'bg-green-100 text-green-800 font-bold' : 'text-slate-500'}`}>WhatsApp</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredList.map(conv => {
            const isWhatsapp = conv.source === 'whatsapp';
            const isSelected = conv.id === selectedId;
            const lastMsgContent = conv.messages.length > 0 ? (conv.messages[conv.messages.length - 1].content || "") : "Fără mesaje";
            return (
              <div key={conv.id} onClick={() => setSelectedId(conv.id)} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-blue-50/50 border-l-4 border-l-slate-800' : 'border-l-4 border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isWhatsapp ? 'bg-green-500' : 'bg-blue-500'}`} />
                    {conv.aiPaused && <span className="bg-amber-100 text-amber-700 text-[9px] px-1 rounded border border-amber-200 font-bold">MANUAL</span>}
                    {conv.customTag && <span className="bg-purple-100 text-purple-700 text-[9px] px-1 rounded border border-purple-200 font-bold truncate max-w-[80px]">{conv.customTag}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(conv.lastMessageAt)}</span>
                </div>
                <div className="font-bold text-slate-800 truncate text-sm">{conv.user?.name || conv.identifier}</div>
                <div className="text-xs text-slate-500 truncate mt-1 opacity-80">{lastMsgContent.substring(0, 45)}...</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="w-2/3 flex flex-col bg-white h-[calc(100vh-64px)]">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center shadow-sm">
               <div>
                  <h2 className="font-bold text-slate-800 text-sm">{selectedConversation.user?.name || selectedConversation.identifier}</h2>
                  <div className="text-xs text-slate-500">{selectedConversation.source} | {selectedConversation.identifier}</div>
               </div>
               <div className="flex items-center gap-2">
                  <input type="text" className="text-xs border border-slate-300 rounded px-2 py-1 w-32" placeholder="+ Etichetă" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onBlur={handleTagBlur} />
                  {selectedConversation.status === 'active' ? (
                    <button onClick={() => updateConversation({ status: 'archived' })} className="bg-white border text-slate-600 hover:text-green-700 px-3 py-1 rounded text-xs">✅ Finalizează</button>
                  ) : (
                    <button onClick={() => updateConversation({ status: 'active' })} className="bg-white border text-slate-600 hover:text-blue-700 px-3 py-1 rounded text-xs">↩️ Redeschide</button>
                  )}
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {selectedConversation.messages.map((msg) => {
                if (msg.role === 'system' || msg.role === 'tool') return null;
                const isAdmin = msg.role === 'admin';
                const isBot = msg.role === 'assistant';
                const alignLeft = isAdmin || isBot;
                return (
                  <div key={msg.id} className={`flex ${alignLeft ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isAdmin ? 'bg-blue-100 border-blue-200 text-blue-900 rounded-tl-none' : isBot ? 'bg-white border-slate-200 text-slate-700 rounded-tl-none' : 'bg-slate-800 text-white rounded-tr-none'}`}>
                      {isAdmin && <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase">Operator Uman</div>}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className="text-[10px] mt-1 text-right opacity-60">{formatDate(msg.createdAt).split(',')[1]}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* FOOTER - AICI ESTE NOUL COMUTATOR */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-3">
              
              {/* ZONA DE CONTROALE (Comutator) */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">CONTROL ROBOT:</span>
                    <button
                        onClick={() => updateConversation({ aiPaused: !selectedConversation.aiPaused })}
                        disabled={isToggling}
                        className={`
                            px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all shadow-sm
                            ${selectedConversation.aiPaused 
                                ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                            }
                        `}
                    >
                        {isToggling ? '...' : selectedConversation.aiPaused ? (
                            <>🔴 ROBOT OPRIT (Discuție Manuală)</>
                        ) : (
                            <>🟢 ROBOT PORNIT (Auto)</>
                        )}
                    </button>
                 </div>
                 {selectedConversation.aiPaused && (
                    <span className="text-[10px] text-red-500 font-medium animate-pulse">
                       ⚠️ Doar tu răspunzi acum.
                    </span>
                 )}
              </div>

              {/* Input Mesaj */}
              <div className="flex gap-2 items-end">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrie mesajul tău..."
                  className="flex-1 min-h-[44px] max-h-[120px] p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-900 bg-white placeholder:text-slate-400"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="h-[44px] px-6 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSending ? '...' : 'Trimite'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 bg-slate-50">
            <p>Selectează o conversație din stânga.</p>
          </div>
        )}
      </div>
    </div>
  );
}