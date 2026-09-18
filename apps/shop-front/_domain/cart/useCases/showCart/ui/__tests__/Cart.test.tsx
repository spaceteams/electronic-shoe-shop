import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '@/_domain/cart/useCases/showCart/ui/Cart'

describe('Cart', () => {
  const mockAction = jest.fn()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(
      'cart',
      JSON.stringify([
        {
          id: '1',
          title: 'Shoe A',
          price: 99.99,
          quantity: 2,
          brand: 'Nike',
          categories: [],
          colors: [],
          size: [],
          availability: 'in_stock',
          description: '',
          materials: [],
          sustainabilityQualifiers: [],
        },
        {
          id: '2',
          title: 'Shoe B',
          price: 49.99,
          quantity: 1,
          brand: 'Adidas',
          categories: [],
          colors: [],
          size: [],
          availability: 'in_stock',
          description: '',
          materials: [],
          sustainabilityQualifiers: [],
        },
      ]),
    )
  })

  it('displays cart items from localStorage', () => {
    render(<Cart loggedIn={true} action={mockAction} />)
    expect(screen.getByText('Shoe A')).toBeInTheDocument()
    expect(screen.getByText('Shoe B')).toBeInTheDocument()
  })

  it('shows German summary header', () => {
    render(<Cart loggedIn={true} action={mockAction} />)
    expect(screen.getByText('Bestellzusammenfassung')).toBeInTheDocument()
  })

  it.skip('calculates total correctly', () => {
    render(<Cart loggedIn={true} action={mockAction} />)
    expect(screen.getByText('$249.97')).toBeInTheDocument()
  })

  it('removes item when clicked', () => {
    render(<Cart loggedIn={true} action={mockAction} />)
    const removeButton = screen.getAllByText('entfernen')[0]
    fireEvent.click(removeButton)
    expect(localStorage.getItem('cart')).not.toContain('Shoe A')
  })
})
