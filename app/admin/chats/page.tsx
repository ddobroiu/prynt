import React from 'react';
import { prisma } from "@/lib/prisma";
import ChatViewer from './ChatViewer';

export const dynamic = 'force-dynamic';

export default async function AdminChatsPage() {
  // Extragem conversațiile, incluzând mesajele și datele userului
  const rawConversations = await prisma.aiConversation.findMany({
    orderBy: { lastMessageAt: 'desc' },
    take: 50,
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

  // Serializăm datele
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
    // Container principal - ocupă toată înălțimea disponibilă minus header-ul adminului
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      
      {/* HEADER PAGINĂ - Fix sus */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Monitorizare Conversații AI</h1>
          <p className="text-xs text-slate-500">Interacțiuni Web și WhatsApp în timp real.</p>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Eșuate</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>WhatsApp</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Web</span>
          </div>
        </div>
      </div>
      
      {/* ZONA DE CONȚINUT - Ocupă restul spațiului */}
      <div className="flex-1 overflow-hidden relative">
        <ChatViewer conversations={conversations} />
      </div>
    </div>
  );
}