import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '../../../../../../lib/adminSession';
import { prisma } from '../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// File fallback cancel map
const DATA_DIR = path.join(process.cwd(), '.data');
const CANCEL_MAP_PATH = path.join(DATA_DIR, 'canceled-orders.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CANCEL_MAP_PATH)) fs.writeFileSync(CANCEL_MAP_PATH, '{}');
}

async function fileCancel(id: string) {
  ensureDir();
  try {
    const raw = await fs.promises.readFile(CANCEL_MAP_PATH, 'utf8').catch(() => '{}');
    let map: Record<string, string> = {};
    try { map = JSON.parse(raw || '{}'); } catch { map = {}; }
    map[id] = new Date().toISOString();
    await fs.promises.writeFile(CANCEL_MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
  } catch {}
}

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const id = ctx.params.id;
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    if (process.env.DATABASE_URL) {
      await prisma.order.update({ where: { id }, data: { status: 'canceled', canceledAt: new Date() } });
    } else {
      await fileCancel(id);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 });
  }
}
