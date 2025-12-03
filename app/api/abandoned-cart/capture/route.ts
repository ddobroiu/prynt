import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { configuratorId, email, configuration, price, quantity } = body;

    // Validation
    if (!configuratorId || !email || !configuration) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // FIX: Email validation cu regex mai robust
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }

    // Check if cart already exists for this email + configurator
    const existingCart = await prisma.abandonedCart.findFirst({
      where: {
        email,
        configuratorId
      }
    });

    const cartData = {
      configuration,
      price: price || 0,
      quantity: quantity || 1,
      capturedAt: new Date().toISOString()
    };

    if (existingCart) {
      // Update existing cart
      await prisma.abandonedCart.update({
        where: { id: existingCart.id },
        data: {
          cartData,
          updatedAt: new Date()
        }
      });

      console.log(`🛒 Updated abandoned cart for ${email} - ${configuratorId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Cart updated',
        action: 'updated'
      });
    } else {
      // Create new abandoned cart
      await prisma.abandonedCart.create({
        data: {
          email,
          configuratorId,
          cartData,
          emailSentCount: 0
        }
      });

      console.log(`🛒 Captured new abandoned cart for ${email} - ${configuratorId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Cart captured',
        action: 'created'
      });
    }

  } catch (error) {
    console.error('Error capturing abandoned cart:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to capture cart',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal error'
    }, { status: 500 });
  }
}

// GET endpoint for testing/debugging
export async function GET() {
  try {
    const carts = await prisma.abandonedCart.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        configuratorId: true,
        emailSentCount: true,
        createdAt: true,
        updatedAt: true,
        lastEmailSent: true
      }
    });

    return NextResponse.json({
      success: true,
      recentCarts: carts,
      count: carts.length
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}