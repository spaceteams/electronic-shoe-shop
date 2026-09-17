'use client'

import type { OrderHistoryItem } from '@/_domain/orderHistory/model'
import { useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'

interface Props {
  order: OrderHistoryItem
  onCancel: () => void
}

const statusConfig = (status: OrderHistoryItem['status']) => {
  switch (status) {
    case 'pending':
      return { icon: <Clock className="w-5 h-5" />, label: 'Pending', className: 'badge-ghost' }
    case 'confirmed':
      return { icon: <Package className="w-5 h-5" />, label: 'Confirmed', className: 'badge-primary' }
    case 'shipped':
      return { icon: <Truck className="w-5 h-5" />, label: 'Shipped', className: 'badge-secondary' }
    case 'delivered':
      return { icon: <CheckCircle className="w-5 h-5" />, label: 'Delivered', className: 'badge-success' }
    case 'cancelled':
      return { icon: <XCircle className="w-5 h-5" />, label: 'Cancelled', className: 'badge-error' }
    default:
      return { icon: <Clock className="w-5 h-5" />, label: 'Pending', className: 'badge-ghost' }
  }
}

export const OrderDetail = ({ order, onCancel }: Props) => {
  const router = useRouter()
  const status = statusConfig(order.status)
  const canCancel = order.status === 'pending' || order.status === 'confirmed'

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => router.back()} className="btn btn-ghost btn-sm gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.orderId.slice(0, 8)}</h1>
        <div className={`badge ${status.className} gap-1`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm p-4">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {item.price.toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl">{order.total.toFixed(2)} €</span>
        </div>
      </div>

      {canCancel && (
        <button type="button" onClick={onCancel} className="btn btn-error btn-block">
          Cancel Order
        </button>
      )}
    </div>
  )
}
