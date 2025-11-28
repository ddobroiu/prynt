import { NextRequest, NextResponse } from 'next/server';
import { 
  validateDiscountCode, 
  applyDiscountCode, 
  createDiscountCode,
  getActiveDiscountCodes,
  deactivateExpiredCodes
} from '@/lib/discountCodes';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'validate': {
        const { code, orderValue, configuratorId } = body;
        
        if (!code || typeof orderValue !== 'number') {
          return NextResponse.json(
            { error: 'Cod și valoarea comenzii sunt obligatorii' },
            { status: 400 }
          );
        }

        const validation = await validateDiscountCode(code, orderValue, configuratorId);
        return NextResponse.json(validation);
      }

      case 'apply': {
        const { code } = body;
        
        if (!code) {
          return NextResponse.json(
            { error: 'Codul este obligatoriu' },
            { status: 400 }
          );
        }

        const applied = await applyDiscountCode(code);
        return NextResponse.json({ success: applied });
      }

      case 'create': {
        const { type, value, minOrderValue, maxUses, validDays, configuratorId, category, prefix } = body;
        
        if (!type || typeof value !== 'number') {
          return NextResponse.json(
            { error: 'Tipul și valoarea sunt obligatorii' },
            { status: 400 }
          );
        }

        const discountCode = await createDiscountCode({
          type,
          value,
          minOrderValue,
          maxUses,
          validDays,
          configuratorId,
          category,
          prefix
        });
        
        return NextResponse.json(discountCode);
      }

      default:
        return NextResponse.json(
          { error: 'Acțiune necunoscută' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Discount API] Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'list': {
        const limit = parseInt(searchParams.get('limit') || '50');
        const codes = await getActiveDiscountCodes(limit);
        return NextResponse.json(codes);
      }

      case 'cleanup': {
        const deactivated = await deactivateExpiredCodes();
        return NextResponse.json({ deactivated });
      }

      default: {
        // Default: return basic info
        const codes = await getActiveDiscountCodes(10);
        return NextResponse.json({
          message: 'Discount Codes API',
          activeCodes: codes.length,
          endpoints: {
            validate: 'POST with { action: "validate", code, orderValue, configuratorId? }',
            apply: 'POST with { action: "apply", code }',
            create: 'POST with { action: "create", type, value, ... }',
            list: 'GET with ?action=list&limit=50',
            cleanup: 'GET with ?action=cleanup'
          }
        });
      }
    }
  } catch (error) {
    console.error('[Discount API] GET Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă' },
      { status: 500 }
    );
  }
}