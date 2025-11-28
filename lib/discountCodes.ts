import { prisma } from '@/lib/prisma';

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // percentage (0-100) or fixed amount in RON
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  configuratorId?: string; // specific configurator or null for all
  category?: string; // email category: 'welcome', 'abandoned', 'newsletter'
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountValidation {
  isValid: boolean;
  error?: string;
  discount?: {
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    amount: number; // calculated discount amount
  };
}

// Generate unique discount code
function generateDiscountCode(prefix = 'PRYNT'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create discount code
export async function createDiscountCode({
  type,
  value,
  minOrderValue = 0,
  maxUses = null,
  validDays = 7,
  configuratorId = null,
  category = null,
  prefix = 'PRYNT'
}: {
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue?: number;
  maxUses?: number | null;
  validDays?: number;
  configuratorId?: string | null;
  category?: string | null;
  prefix?: string;
}): Promise<DiscountCode> {
  
  let code: string;
  let attempts = 0;
  
  // Generate unique code
  do {
    code = generateDiscountCode(prefix);
    attempts++;
    
    const existing = await prisma.discountCode.findUnique({
      where: { code }
    });
    
    if (!existing) break;
    
    if (attempts > 10) {
      throw new Error('Could not generate unique discount code');
    }
  } while (attempts <= 10);
  
  const validFrom = new Date();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);
  
  const discountCode = await prisma.discountCode.create({
    data: {
      code,
      type,
      value,
      minOrderValue,
      maxUses,
      currentUses: 0,
      validFrom,
      validUntil,
      isActive: true,
      configuratorId,
      category
    }
  });
  
  console.log(`[Discount] Created code: ${code} (${type}: ${value}${type === 'percentage' ? '%' : ' RON'})`);
  
  return discountCode as DiscountCode;
}

// Validate discount code
export async function validateDiscountCode(
  code: string, 
  orderValue: number, 
  configuratorId?: string
): Promise<DiscountValidation> {
  
  const discountCode = await prisma.discountCode.findUnique({
    where: { 
      code: code.toUpperCase(),
      isActive: true
    }
  });
  
  if (!discountCode) {
    return { isValid: false, error: 'Codul de reducere nu există sau nu este valid' };
  }
  
  const now = new Date();
  
  // Check expiry
  if (now < discountCode.validFrom || now > discountCode.validUntil) {
    return { isValid: false, error: 'Codul de reducere a expirat' };
  }
  
  // Check usage limit
  if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
    return { isValid: false, error: 'Codul de reducere a fost folosit prea multe ori' };
  }
  
  // Check minimum order value
  if (discountCode.minOrderValue && orderValue < discountCode.minOrderValue) {
    return { 
      isValid: false, 
      error: `Comanda trebuie să fie de minimum ${discountCode.minOrderValue} RON pentru acest cod` 
    };
  }
  
  // Check configurator restriction
  if (discountCode.configuratorId && configuratorId && discountCode.configuratorId !== configuratorId) {
    return { isValid: false, error: 'Codul nu este valid pentru acest produs' };
  }
  
  // Calculate discount amount
  let discountAmount = 0;
  
  switch (discountCode.type) {
    case 'percentage':
      discountAmount = Math.min((orderValue * discountCode.value) / 100, orderValue);
      break;
    case 'fixed':
      discountAmount = Math.min(discountCode.value, orderValue);
      break;
    case 'free_shipping':
      discountAmount = 15; // Standard shipping cost
      break;
  }
  
  return {
    isValid: true,
    discount: {
      type: discountCode.type,
      value: discountCode.value,
      amount: Math.round(discountAmount * 100) / 100
    }
  };
}

// Apply discount code (mark as used)
export async function applyDiscountCode(code: string): Promise<boolean> {
  try {
    const result = await prisma.discountCode.update({
      where: { 
        code: code.toUpperCase(),
        isActive: true
      },
      data: {
        currentUses: {
          increment: 1
        }
      }
    });
    
    console.log(`[Discount] Applied code: ${code} (uses: ${result.currentUses})`);
    return true;
  } catch (error) {
    console.error('[Discount] Failed to apply code:', error);
    return false;
  }
}

// Create email-specific discount codes
export async function createEmailDiscountCode(
  emailType: 'welcome' | 'abandoned_gentle' | 'abandoned_discount' | 'abandoned_final' | 'newsletter',
  configuratorId?: string
): Promise<DiscountCode> {
  
  let codeConfig: {
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    minOrderValue: number;
    maxUses: number;
    validDays: number;
    prefix: string;
  };
  
  switch (emailType) {
    case 'welcome':
      codeConfig = {
        type: 'free_shipping',
        value: 0,
        minOrderValue: 50,
        maxUses: 1,
        validDays: 14,
        prefix: 'WELCOME'
      };
      break;
      
    case 'abandoned_gentle':
      codeConfig = {
        type: 'free_shipping',
        value: 0,
        minOrderValue: 0,
        maxUses: 1,
        validDays: 7,
        prefix: 'RETURN'
      };
      break;
      
    case 'abandoned_discount':
      codeConfig = {
        type: 'percentage',
        value: 10,
        minOrderValue: 100,
        maxUses: 1,
        validDays: 2,
        prefix: 'SAVE10'
      };
      break;
      
    case 'abandoned_final':
      codeConfig = {
        type: 'percentage',
        value: 15,
        minOrderValue: 50,
        maxUses: 1,
        validDays: 1,
        prefix: 'FINAL15'
      };
      break;
      
    case 'newsletter':
      codeConfig = {
        type: 'percentage',
        value: 5,
        minOrderValue: 75,
        maxUses: 100, // Can be used by multiple subscribers
        validDays: 30,
        prefix: 'NEWS5'
      };
      break;
  }
  
  return await createDiscountCode({
    ...codeConfig,
    configuratorId,
    category: emailType
  });
}

// Get active discount codes for admin
export async function getActiveDiscountCodes(limit = 50) {
  return await prisma.discountCode.findMany({
    where: {
      isActive: true,
      validUntil: {
        gte: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });
}

// Deactivate expired codes (cleanup function)
export async function deactivateExpiredCodes(): Promise<number> {
  const result = await prisma.discountCode.updateMany({
    where: {
      isActive: true,
      validUntil: {
        lt: new Date()
      }
    },
    data: {
      isActive: false
    }
  });
  
  console.log(`[Discount] Deactivated ${result.count} expired codes`);
  return result.count;
}

export {
  generateDiscountCode
};