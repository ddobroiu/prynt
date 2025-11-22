const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BASE = 'https://api.dpd.ro/v1/track';

function normalizeAwb(a) {
  if (!a) return null;
  return String(a).trim();
}

function mapLastOpToStatus(op) {
  if (!op) return 'unknown';
  const code = Number(op.operationCode || 0);
  const desc = String(op.description || '').toLowerCase();
  if (desc.includes('deliv') || code === -14) return 'delivered';
  if (code === 12 || desc.includes('out for delivery') || desc.includes('out for delivery')) return 'out_for_delivery';
  if (code === 39 || desc.includes('pick') || desc.includes('pickup') || desc.includes('picked')) return 'picked_up';
  if (desc.includes('in transit') || desc.includes('transit') || code === 2) return 'in_transit';
  if (desc.includes('unsuccess') || desc.includes('failed') || desc.includes('exception')) return 'exception';
  return 'unknown';
}

async function fetchTrack(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return { raw: txt };
  }
}

async function main() {
  const userName = process.env.DPD_USERNAME || process.env.DPD_USER;
  const password = process.env.DPD_PASSWORD || process.env.DPD_PASS;
  const clientSystemId = process.env.DPD_CLIENTSYSTEMID;

  if (!userName || !password) {
    console.error('Set DPD_USERNAME and DPD_PASSWORD environment variables');
    process.exit(1);
  }

  const orders = await prisma.order.findMany({ where: { awbNumber: { not: null } }, select: { id: true, awbNumber: true } });
  if (!orders.length) {
    console.log('No orders with AWB found.');
    return;
  }

  const dataDir = path.join(process.cwd(), 'data', 'tracking');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  for (const o of orders) {
    const awb = normalizeAwb(o.awbNumber);
    if (!awb) continue;

    const body = {
      userName,
      password,
      language: 'EN',
      parcels: [
        { externalCarrierParcelNumber: awb }
      ],
      lastOperationOnly: false
    };
    if (clientSystemId) body.clientSystemId = Number(clientSystemId);

    console.log('Polling AWB', awb);
    try {
      const resp = await fetchTrack(body);
      const file = path.join(dataDir, `${awb.replace(/[^a-zA-Z0-9_-]/g,'_')}-poll.json`);
      fs.writeFileSync(file, JSON.stringify({ at: new Date().toISOString(), request: body, response: resp }, null, 2));

      // Try to extract last operation and map to internal status for logging
      const parcels = resp.parcels || resp.parcels || [];
      const tracked = Array.isArray(parcels) ? parcels[0] : parcels;
      const ops = (tracked && tracked.operations) || [];
      const lastOp = ops.length ? ops[ops.length - 1] : null;
      const mapped = mapLastOpToStatus(lastOp);
      console.log(`AWB ${awb} -> mapped status: ${mapped}`);
    } catch (e) {
      console.error('Error polling AWB', awb, e.message || e);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
