import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/emailMarketing';
import { deactivateExpiredCodes } from '@/lib/discountCodes';

export const maxDuration = 300; // 5 minutes max
export const dynamic = 'force-dynamic';

interface DailyStats {
  processed: number;
  sent: number;
  errors: string[];
  expiredCodes: number;
  newAbandoned: number;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  console.log('🤖 [Daily Cron] Starting automated marketing tasks...');
  
  const stats: DailyStats = {
    processed: 0,
    sent: 0,
    errors: [],
    expiredCodes: 0,
    newAbandoned: 0
  };

  try {
    const now = new Date();
    
    // 1. CLEANUP: Deactivate expired discount codes
    console.log('🧹 [Cleanup] Deactivating expired codes...');
    stats.expiredCodes = await deactivateExpiredCodes();
    
    // 2. ABANDONED CART RECOVERY: Process all abandoned carts
    console.log('📧 [Email] Processing abandoned cart recovery...');
    
    // Find abandoned carts for different email stages
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);  
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Get all abandoned carts that need emails
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        OR: [
          // First email (1+ hours old, no emails sent)
          {
            emailSentCount: 0,
            createdAt: { lte: oneHourAgo }
          },
          // Second email (1+ days old, 1 email sent, last email 20+ hours ago)
          {
            emailSentCount: 1,
            createdAt: { lte: oneDayAgo },
            OR: [
              { lastEmailSent: null },
              { lastEmailSent: { lte: new Date(now.getTime() - 20 * 60 * 60 * 1000) } }
            ]
          },
          // Third email (3+ days old, 2 emails sent, last email 44+ hours ago)
          {
            emailSentCount: 2, 
            createdAt: { lte: threeDaysAgo },
            OR: [
              { lastEmailSent: null },
              { lastEmailSent: { lte: new Date(now.getTime() - 44 * 60 * 60 * 1000) } }
            ]
          }
        ]
      },
      take: 100, // Process max 100 per day to avoid overwhelming
      orderBy: { createdAt: 'asc' }
    });

    console.log(`📊 Found ${abandonedCarts.length} abandoned carts to process`);
    stats.newAbandoned = abandonedCarts.length;

    // Process each abandoned cart
    for (const cart of abandonedCarts) {
      try {
        stats.processed++;
        
        // Determine email type based on sent count
        let emailType: 'gentle' | 'discount' | 'final';
        let discountPercent = 0;
        
        if (cart.emailSentCount === 0) {
          emailType = 'gentle';
        } else if (cart.emailSentCount === 1) {
          emailType = 'discount'; 
          discountPercent = 10;
        } else {
          emailType = 'final';
          discountPercent = 15;
        }
        
        // Send email
        const success = await sendAbandonedCartEmail({
          email: cart.email,
          configuratorId: cart.configuratorId,
          cartData: cart.cartData,
          emailType,
          discountPercent
        });
        
        if (success) {
          // Update cart record
          await prisma.abandonedCart.update({
            where: { id: cart.id },
            data: {
              emailSentCount: cart.emailSentCount + 1,
              lastEmailSent: now
            }
          });
          
          stats.sent++;
          console.log(`✅ Sent ${emailType} email to ${cart.email} for ${cart.configuratorId}`);
        } else {
          stats.errors.push(`Failed to send ${emailType} email to ${cart.email}`);
        }
        
        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        const errorMsg = `Error processing cart ${cart.id}: ${(error as Error).message}`;
        stats.errors.push(errorMsg);
        console.error('❌', errorMsg);
      }
    }
    
    // 3. ANALYTICS: Log daily summary
    const runtime = Math.round((Date.now() - startTime) / 1000);
    
    console.log(`
🎯 [Daily Cron] Completed in ${runtime}s
📊 Stats:
   • Abandoned carts found: ${stats.newAbandoned}
   • Emails processed: ${stats.processed}  
   • Emails sent: ${stats.sent}
   • Expired codes cleaned: ${stats.expiredCodes}
   • Errors: ${stats.errors.length}
    `);
    
    // Optional: Send daily report email to admin
    if (process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'PRYNT System <system@prynt.ro>',
          to: process.env.ADMIN_EMAIL,
          subject: `📊 Raport zilnic marketing - ${stats.sent} emailuri trimise`,
          html: `
          <h2>🤖 Raport automat zilnic</h2>
          <p><strong>Data:</strong> ${now.toLocaleDateString('ro-RO')}</p>
          
          <h3>📧 Email Marketing</h3>
          <ul>
            <li>Coșuri abandonate găsite: <strong>${stats.newAbandoned}</strong></li>
            <li>Emailuri procesate: <strong>${stats.processed}</strong></li>  
            <li>Emailuri trimise cu succes: <strong>${stats.sent}</strong></li>
          </ul>
          
          <h3>🧹 Maintenance</h3>
          <ul>
            <li>Coduri de reducere expirate șterse: <strong>${stats.expiredCodes}</strong></li>
            <li>Runtime: <strong>${runtime}s</strong></li>
          </ul>
          
          ${stats.errors.length > 0 ? `
          <h3>⚠️ Erori</h3>
          <ul>${stats.errors.map(err => `<li>${err}</li>`).join('')}</ul>
          ` : '<p>✅ <strong>Nicio eroare!</strong></p>'}
          
          <p><small>Sistem automat PRYNT</small></p>
          `
        });
      } catch (emailError) {
        console.error('Failed to send daily report:', emailError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Daily marketing automation completed successfully`,
      stats,
      runtime: `${runtime}s`
    });
    
  } catch (error) {
    console.error('❌ [Daily Cron] Fatal error:', error);
    
    return NextResponse.json({
      success: false, 
      message: 'Daily cron job failed',
      error: (error as Error).message,
      stats
    }, { status: 500 });
  }
}

// GET endpoint for manual trigger & status check
export async function GET() {
  try {
    // Return system status and next actions
    const now = new Date();
    const abandonedCount = await prisma.abandonedCart.count({
      where: {
        emailSentCount: { lt: 3 }, // Still has emails to send
        createdAt: { lte: new Date(now.getTime() - 60 * 60 * 1000) } // Older than 1h
      }
    });
    
    const expiredCodes = await prisma.discountCode.count({
      where: {
        isActive: true,
        validUntil: { lt: now }
      }
    });
    
    return NextResponse.json({
      status: 'ready',
      timestamp: now.toISOString(),
      pendingActions: {
        abandonedCartsToProcess: abandonedCount,
        expiredCodesToClean: expiredCodes
      },
      message: 'Daily cron system is ready. POST to execute.'
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: (error as Error).message
    }, { status: 500 });
  }
}