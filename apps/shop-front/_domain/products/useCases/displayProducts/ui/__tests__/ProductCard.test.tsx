import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/_domain/products/useCases/displayProducts/ui/ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '123',
    title: 'Nike Air Max',
    brand: 'Nike',
    price: 129.99,
    salePrice: 99.99,
    onSale: true,
    description: 'Comfortable running shoes',
    categories: ['running', 'sport'],
    colors: ['black', 'white'],
    size: [42, 43, 44],
    availability: 'in_stock',
    materials: ['mesh', 'rubber'],
    sustainabilityQualifiers: ['recycled'],
  }

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Nike Air Max')).toBeInTheDocument()
  })

  it('shows sale badge when on sale', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })

  it('displays sale price with strikethrough original', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('99.99 €')).toBeInTheDocument()
  })

  it('shows categories as badges', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('running')).toBeInTheDocument()
    expect(screen.getByText('sport')).toBeInTheDocument()
  })
})
