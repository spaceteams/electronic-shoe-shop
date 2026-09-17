import { render, screen } from '@testing-library/react'
import { OrderHistoryList } from '@/_domain/orderHistory/useCases/getOrderHistory/ui/OrderHistoryList'
import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

describe('OrderHistoryList', () => {
  const mockOrders: OrderHistoryItem[] = [
    {
      orderId: 'ord-1',
      userId: 'user@example.com',
      items: [
        {
          id: 'prod-1',
          title: 'Nike Air',
          brand: 'Nike',
          price: 129.99,
          quantity: 1,
          categories: [],
          colors: [],
          size: [],
          availability: 'in_stock',
          description: '',
          materials: [],
          sustainabilityQualifiers: [],
        },
      ],
      total: 129.99,
      status: 'delivered',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      orderId: 'ord-2',
      userId: 'user@example.com',
      items: [],
      total: 0,
      status: 'pending',
      createdAt: '2024-03-20T14:30:00Z',
    },
  ]

  it('renders order list', () => {
    render(<OrderHistoryList orders={mockOrders} />)
    expect(screen.getByText('Order History')).toBeInTheDocument()
    expect(screen.getByText(/ord-1/)).toBeInTheDocument()
    expect(screen.getByText(/ord-2/)).toBeInTheDocument()
  })

  it('shows empty state when no orders', () => {
    render(<OrderHistoryList orders={[]} />)
    expect(screen.getByText('No orders yet')).toBeInTheDocument()
  })

  /* TODO: pagination not ready — uncomment once backend supports pagination
  it('renders pagination controls', () => {
    render(<OrderHistoryList orders={mockOrders} />)
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
  })
  */
})
