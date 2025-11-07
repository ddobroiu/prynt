import React from 'react'
import { useCart } from './CartProvider'

function formatRon(value: number) {
  return value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RON'
}

export default function CartWidget() {
  const { state, dispatch, getSubtotal } = useCart()

  if (!state.items.length) return <div>Coș gol</div>

  return (
    <div>
      {state.items.map((item: any) => {
        const title = item.title || item.name || item.product?.title || 'Produs fără nume'
        const price = Number(item.price) || 0
        const qty = Number(item.quantity) || 1
        const lineTotal = price * qty

        return (
          <div key={item.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>{title}</div> {/* nume afișat clar */}
            <div style={{ color: '#666' }}>
              {formatRon(price)} × {qty} = <strong>{formatRon(lineTotal)}</strong>
            </div>
            <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>Șterge</button>
          </div>
        )
      })}

      <hr />
      <div>
        <div>Subtotal: <strong>{formatRon(getSubtotal())}</strong></div>
        {/* afişează şi total final cu livrare etc */}
      </div>
    </div>
  )
}