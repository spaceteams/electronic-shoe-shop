import { render, screen, fireEvent } from '@testing-library/react'
import { OrderDetail } from '@/_domain/orderHistory/useCases/getOrderDetail/ui/OrderDetail'
import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

describe('OrderDetail', () => {
  const mockOrder: OrderHistoryItem = {
    orderId: 'ord-123',
    userId: 'user@example.com',
    items: [
      {
        id: 'prod-1',
        title: 'Nike Air Max',
        brand: 'Nike',
        price: 129.99,
        quantity: 2,
        categories: [],
        colors: [],
        size: [],
        availability: 'in_stock',
        description: '',
        materials: [],
        sustainabilityQualifiers: [],
      },
    ],
    total: 259.98,
    status: 'pending',
    createdAt: '2024-06-15T10:00:00Z',
  }

  const mockCancel = jest.fn()

  it('renders order details', () => {
    const { container } = render(<OrderDetail order={mockOrder} onCancel={mockCancel} />)
    expect(screen.getByText(/ord-123/)).toBeInTheDocument()
    expect(screen.getByText('Nike Air Max')).toBeInTheDocument()

    // Use more specific query to avoid matching both item total and order total
    const totalElements = screen.getAllByText('259.98 €')
    expect(totalElements.length).toBeGreaterThanOrEqual(1)

    // The order total should be in the summary section near "Total"
    const summarySection = container.querySelector('.card .border-t')
    expect(summarySection?.textContent).toContain('259.98')
  })

  it('shows cancel button for pending orders', () => {
    render(<OrderDetail order={mockOrder} onCancel={mockCancel} />)
    expect(screen.getByText('Cancel Order')).toBeInTheDocument()
  })

  it('hides cancel button for delivered orders', () => {
    const deliveredOrder = { ...mockOrder, status: 'delivered' as const }
    render(<OrderDetail order={deliveredOrder} onCancel={mockCancel} />)
    expect(screen.queryByText('Cancel Order')).not.toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', () => {
    render(<OrderDetail order={mockOrder} onCancel={mockCancel} />)
    fireEvent.click(screen.getByText('Cancel Order'))
    expect(mockCancel).toHaveBeenCalledTimes(1)
  })
})
