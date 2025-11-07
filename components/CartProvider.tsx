import React, { useReducer, createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type CartItem = {
  id: string
  title?: string
  name?: string
  price: number | string
  quantity?: number
  [key: string]: any
}

type State = {
  items: CartItem[]
}

const initialState: State = { items: [] }

function normalizeItem(raw: Partial<CartItem>) {
  // extrage numeric din string-uri de tip "75 RON" sau "75,00"
  const rawPrice = raw.price ?? 0
  let priceNumber = 0
  if (typeof rawPrice === 'string') {
    // elimină tot ce nu e cifră, punct sau virgulă, apoi transformă virgulă în punct
    const cleaned = rawPrice.replace(/[^\d.,-]/g, '').replace(',', '.')
    priceNumber = Number(cleaned)
  } else {
    priceNumber = Number(rawPrice)
  }
  if (!Number.isFinite(priceNumber)) priceNumber = 0

  const quantity = Number(raw.quantity) || 1
  const title = raw.title || raw.name || raw.product?.title || raw.product?.name || ''

  return {
    ...raw,
    price: priceNumber,
    quantity,
    title,
  } as CartItem
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = normalizeItem(action.payload)
      // simplu exemplu de adăugat (pot adapta logica merge/replace)
      return { items: [...state.items, item] }
    }
    case 'REMOVE_ITEM': {
      return { items: state.items.filter(i => i.id !== action.payload) }
    }
    // alte acțiuni...
    default:
      return state
  }
}

export const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  function getSubtotal() {
    return state.items.reduce((sum, it) => {
      const price = Number(it.price) || 0
      const qty = Number(it.quantity) || 1
      return sum + price * qty
    }, 0)
  }

  return (
    <CartContext.Provider value={{ state, dispatch, getSubtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}