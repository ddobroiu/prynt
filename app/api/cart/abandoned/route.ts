import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/emailMarketing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Track abandoned cart for configurators
export async function POST(req: Request) {
  try {
    const { email, configuratorId, cartData, sessionId } = await req.json();

    if (!email || !configuratorId) {
      return NextResponse.json(
        { message: 'Email și configuratorId sunt obligatorii.' },
        { status: 400 }
      );
    }

    // Save abandoned cart
    const abandonedCart = await prisma.abandonedCart.upsert({
      where: {
        email_configuratorId: {
          email,
          configuratorId
        }
      },
      update: {
        cartData,
        sessionId,
        lastUpdated: new Date(),
        emailSentCount: 0, // Reset email count on cart update
        lastEmailSent: null
      },
      create: {
        email,
        configuratorId,
        cartData,
        sessionId,
        emailSentCount: 0,
        createdAt: new Date(),
        lastUpdated: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      abandonedCartId: abandonedCart.id
    });

  } catch (error) {
    console.error('[Abandoned Cart]', error);
    return NextResponse.json(
      { message: 'Eroare la salvarea coșului.' },
      { status: 500 }
    );
  }
}

// Send abandoned cart recovery emails (called by cron or manual trigger)
export async function PUT(req: Request) {
  try {
    const { delay = '1h' } = await req.json();

    const cutoffTime = new Date();
    
    // Calculate cutoff based on delay
    switch (delay) {
      case '1h':
        cutoffTime.setHours(cutoffTime.getHours() - 1);
        break;
      case '24h':
        cutoffTime.setHours(cutoffTime.getHours() - 24);
        break;
      case '3d':
        cutoffTime.setDate(cutoffTime.getDate() - 3);
        break;
    }

    // Get abandoned carts for this delay period
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        lastUpdated: {
          lte: cutoffTime
        },
        emailSentCount: {
          lt: delay === '1h' ? 1 : delay === '24h' ? 2 : 3
        },
        OR: [
          { lastEmailSent: null },
          {
            lastEmailSent: {
              lte: new Date(Date.now() - (delay === '1h' ? 0 : delay === '24h' ? 23 * 60 * 60 * 1000 : 2 * 24 * 60 * 60 * 1000))
            }
          }
        ]
      },
      take: 50 // Process in batches
    });

    const results = [];

    for (const cart of abandonedCarts) {
      try {
        // Determine email type based on attempt count
        let emailType: 'gentle' | 'discount' | 'final';
        let discountPercent = 0;
        
        if (cart.emailSentCount === 0) {
          emailType = 'gentle';
        } else if (cart.emailSentCount === 1) {
          emailType = 'discount';
          discountPercent = 10; // 10% discount
        } else {
          emailType = 'final';
          discountPercent = 15; // 15% discount for final attempt
        }

        await sendAbandonedCartEmail({
          email: cart.email,
          configuratorId: cart.configuratorId,
          cartData: cart.cartData,
          emailType,
          discountPercent
        });
        
        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: {
            emailSentCount: cart.emailSentCount + 1,
            lastEmailSent: new Date()
          }
        });

        results.push({ email: cart.email, configuratorId: cart.configuratorId, success: true });
      } catch (error) {
        console.error(`[Abandoned Cart Email] Failed for ${cart.email}:`, error);
        results.push({ email: cart.email, configuratorId: cart.configuratorId, success: false, error: (error as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    });

  } catch (error) {
    console.error('[Abandoned Cart Recovery]', error);
    return NextResponse.json(
      { message: 'Eroare la trimiterea email-urilor.' },
      { status: 500 }
    );
  }
}