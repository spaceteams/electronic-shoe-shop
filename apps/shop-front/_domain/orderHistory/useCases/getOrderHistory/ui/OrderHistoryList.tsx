import type { OrderHistoryItem } from '@/_domain/orderHistory/model'
import Link from 'next/link'
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Props {
  orders: OrderHistoryItem[]
}

const statusIcon = (status: OrderHistoryItem['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />
    case 'confirmed':
      return <Package className="w-4 h-4" />
    case 'shipped':
      return <Truck className="w-4 h-4" />
    case 'delivered':
      return <CheckCircle className="w-4 h-4" />
    case 'cancelled':
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const statusClass = (status: OrderHistoryItem['status']) => {
  switch (status) {
    case 'pending':
      return 'badge-ghost'
    case 'confirmed':
      return 'badge-primary'
    case 'shipped':
      return 'badge-secondary'
    case 'delivered':
      return 'badge-success'
    case 'cancelled':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

export const OrderHistoryList = ({ orders }: Props) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold">No orders yet</h2>
        <p className="text-gray-500 mt-2">Your order history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.map((order) => (
        <Link key={order.orderId} href={`/orders/${order.orderId}`} className="block">
          <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon(order.status)}
                  <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Order #{order.orderId.slice(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{order.total.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
