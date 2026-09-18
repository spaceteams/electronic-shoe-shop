import { render } from '@testing-library/react'
import { Header } from '@/_uiFragments/layout/Header'

describe('Header', () => {
  it('matches snapshot', () => {
    const { container } = render(<Header />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('has logo link', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('a[href="/"]')).toBeTruthy()
  })
})
