import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/emailMarketing';

export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

interface AbandonedCartWithData {
  id: string;
  email: string;
  configuratorId: string;
  cartData: any;
  sessionId: string | null;
  emailSentCount: number;
  createdAt: Date;
  lastEmailSent: Date | null;
}

export async function POST() {
  try {
    console.log('[Cron] Starting abandoned cart email job...');

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Find abandoned carts that need emails
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        OR: [
          // First email (1 hour after abandonment)
          {
            emailSentCount: 0,
            createdAt: {
              lte: oneHourAgo
            }
          },
          // Second email (24 hours after abandonment)
          {
            emailSentCount: 1,
            createdAt: {
              lte: oneDayAgo
            },
            lastEmailSent: {
              lte: new Date(now.getTime() - 20 * 60 * 60 * 1000) // At least 20h since last email
            }
          },
          // Third email (3 days after abandonment)
          {
            emailSentCount: 2,
            createdAt: {
              lte: threeDaysAgo
            },
            lastEmailSent: {
              lte: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // At least 2 days since last email
            }
          }
        ]
      }
    }) as AbandonedCartWithData[];

    console.log(`[Cron] Found ${abandonedCarts.length} abandoned carts to process`);

    const results = {
      processed: 0,
      sent: 0,
      errors: 0
    };

    for (const cart of abandonedCarts) {
      try {
        results.processed++;

        // Determine email sequence stage
        let emailType: 'gentle' | 'discount' | 'final';
        let discountPercent = 0;

        if (cart.emailSentCount === 0) {
          emailType = 'gentle';
        } else if (cart.emailSentCount === 1) {
          emailType = 'discount';
          discountPercent = 10; // 10% discount
        } else {
          emailType = 'final';
          discountPercent = 15; // 15% final discount
        }

        // Send the email
        const emailSent = await sendAbandonedCartEmail({
          email: cart.email,
          configuratorId: cart.configuratorId,
          cartData: cart.cartData,
          emailType,
          discountPercent
        });

        if (emailSent) {
          // Update cart record
          await prisma.abandonedCart.update({
            where: { id: cart.id },
            data: {
              emailSentCount: cart.emailSentCount + 1,
              lastEmailSent: now
            }
          });

          results.sent++;
          console.log(`[Cron] Sent ${emailType} email to ${cart.email} for ${cart.configuratorId}`);
        }

      } catch (error) {
        results.errors++;
        console.error(`[Cron] Error processing cart ${cart.id}:`, error);
      }
    }

    // Clean up old abandoned carts (older than 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    await prisma.abandonedCart.deleteMany({
      where: {
        createdAt: {
          lte: thirtyDaysAgo
        }
      }
    });

    console.log(`[Cron] Finished. Results:`, results);

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results
    });

  } catch (error) {
    console.error('[Cron] Abandoned cart email job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to trigger abandoned cart email job',
    endpoint: '/api/cron/abandoned-cart-emails'
  });
}