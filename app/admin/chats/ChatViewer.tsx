'use client';

import { useState } from 'react';

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
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
  lastMessageAt: Date;
  messages: Message[];
  user: User | null;
};

export default function ChatViewer({ conversations }: { conversations: Conversation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'whatsapp' | 'web'>('all');

  const selectedConversation = conversations.find(c => c.id === selectedId);

  // Filtrare logică
  const filteredList = conversations.filter(c => {
    if (filter === 'error') return c.hasError;
    if (filter === 'whatsapp') return c.source === 'whatsapp';
    if (filter === 'web') return c.source === 'web';
    return true;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('ro-RO', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-full">
      {/* SIDEBAR LISTA */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
        {/* Filtre */}
        <div className="p-3 border-b border-slate-200 flex gap-2 overflow-x-auto">
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
                  {conv.messages[conv.messages.length - 1]?.content.substring(0, 40)}...
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
      <div className="w-2/3 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Header Chat */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
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
                const isBot = msg.role === 'assistant';
                const isSystem = msg.role === 'system' || msg.role === 'tool';
                
                if (isSystem) return null; // Ascundem mesajele interne pentru claritate

                return (
                  <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isBot 
                          ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                          : 'bg-slate-800 text-white rounded-tr-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                      <div className={`text-[10px] mt-1 text-right ${isBot ? 'text-slate-400' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
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