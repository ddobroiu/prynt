import React from 'react';
import { prisma } from "@/lib/prisma";
import ChatViewer from './ChatViewer';

export const dynamic = 'force-dynamic';

export default async function AdminChatsPage() {
  // Extragem conversațiile, incluzând mesajele și datele userului (dacă există)
  const rawConversations = await prisma.aiConversation.findMany({
    orderBy: { lastMessageAt: 'desc' },
    take: 50, // Ultimele 50 de conversații active
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    }
  });

  // Serializăm datele pentru a evita erorile de tip "Date object" în Client Component
  const conversations = rawConversations.map(conv => ({
    ...conv,
    lastMessageAt: conv.lastMessageAt.toISOString(),
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
    messages: conv.messages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt.toISOString()
    }))
  }));

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitorizare Conversații AI</h1>
          <p className="text-sm text-slate-500">Vezi interacțiunile de pe Web și WhatsApp în timp real.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></span>
            <span>Eșuate (Fallback)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>WhatsApp</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Web</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <ChatViewer conversations={conversations} />
      </div>
    </div>
  );
}