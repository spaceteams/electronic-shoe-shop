import Cart from '@/_domain/cart/useCases/showCart/ui/Cart'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import type { ProductWithQuantity } from '@/_domain/products/model'
import { orderService } from '@/_domain/cart'
import { voucherService } from '@/_domain/voucher'

export const dynamic = 'force-dynamic'

type ActionState = {
  errors: Record<string, { message: string }>
  values: ProductWithQuantity[]
}

const createOrder = () => async (
  _previousState: ActionState,
  input: { cart: ProductWithQuantity[]; voucherCode?: string },
) => {
  'use server'

  const session = await getServerSession(authOptions)
  const userId = session?.user?.email

  if (!userId) {
    const errors = {
      unauthorized: { message: 'Not authorized' },
    }

    return {
      values: [],
      errors,
    }
  }

  await orderService.createOrder(userId, input.cart, input.voucherCode)

  return {
    values: input.cart,
    errors: {},
  }
}

const validateVoucher = async (code: string) => {
  'use server'

  return voucherService.validate(code)
}

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <Cart loggedIn={!!session} action={createOrder()} validateVoucher={validateVoucher} />
    </>
  )
}
