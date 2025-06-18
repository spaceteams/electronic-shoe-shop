import { ShoppingCart } from 'lucide-react'

export const MiniCart = () => {
  return (
    <a className={'btn btn-ghost btn-circle'} href={'/cart'}>
      <ShoppingCart />
    </a>
  )
}
