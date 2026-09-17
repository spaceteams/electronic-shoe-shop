import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { userService } from '@/_domain/user'
import { orderHistoryService } from '@/_domain/orderHistory'
import { OrderHistoryList } from '@/_domain/orderHistory/useCases/getOrderHistory/ui/OrderHistoryList'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/user/login')
  }

  const profile = await userService.showProfile(session.user.email)

  if (!profile) {
    redirect('/user/login')
  }

  const { orders } = await orderHistoryService.getOrderHistory(session.user.email)

  return <OrderHistoryList orders={orders} />
}
