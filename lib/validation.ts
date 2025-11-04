import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().optional(),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2).optional(),
  postalCode: z.string().min(4),
  country: z.string().default('RO'),
  phone: z.string().min(7).optional(),
});

export const customerSchema = z.object({
  isCompany: z.boolean().default(false),
  fullName: z.string().min(2).optional(),
  email: z.string().email(),
  phone: z.string().min(7).optional(),

  companyName: z.string().optional(),
  cui: z.string().optional(),
  regCom: z.string().optional(),

  billingAddress: addressSchema,
  shippingDifferent: z.boolean().default(false),
  shippingAddress: addressSchema.optional(),
});

export const cartItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  vatRate: z.number().min(0),
  weightGr: z.number().int().min(0).default(0),
  lengthMm: z.number().int().optional(),
  widthMm: z.number().int().optional(),
  heightMm: z.number().int().optional(),
});

export const createOrderSchema = z.object({
  currency: z.string().default('RON'),
  items: z.array(cartItemSchema).min(1),
  customer: customerSchema,
  shippingMethod: z.literal('dpd_standard').default('dpd_standard'),
  shippingCost: z.number().min(0).default(24),
  discountTotal: z.number().min(0).default(0),
  paymentMethod: z.union([z.literal('card'), z.literal('cash_on_delivery')]).default('card'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
