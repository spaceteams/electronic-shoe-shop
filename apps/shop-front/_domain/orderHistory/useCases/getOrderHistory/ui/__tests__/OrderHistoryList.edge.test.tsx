import { render, screen } from '@testing-library/react'
import { OrderHistoryList } from '@/_domain/orderHistory/useCases/getOrderHistory/ui/OrderHistoryList'
import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

describe('OrderHistoryList edge cases', () => {
  it('handles orders with zero items gracefully', () => {
    const orders: OrderHistoryItem[] = [
      {
        orderId: 'ord-empty',
        userId: 'user@example.com',
        items: [],
        total: 0,
        status: 'cancelled',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]

    render(<OrderHistoryList orders={orders} />)
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })

  it('renders orders in the order they are provided', () => {
    // NOTE: sorting is done in the useCase, not the component.
    // This test verifies the component is a pure renderer.
    const orders: OrderHistoryItem[] = [
      {
        orderId: 'ord-1',
        userId: 'user@example.com',
        items: [],
        total: 100,
        status: 'delivered',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        orderId: 'ord-2',
        userId: 'user@example.com',
        items: [],
        total: 200,
        status: 'pending',
        createdAt: '2024-12-01T00:00:00Z',
      },
    ]

    render(<OrderHistoryList orders={orders} />)
    const orderLinks = screen.getAllByRole('link')
    expect(orderLinks[0]).toHaveAttribute('href', '/orders/ord-1')
    expect(orderLinks[1]).toHaveAttribute('href', '/orders/ord-2')
  })
})
