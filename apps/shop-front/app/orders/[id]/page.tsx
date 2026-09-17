import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { orderHistoryService } from '@/_domain/orderHistory'
import { OrderDetail } from '@/_domain/orderHistory/useCases/getOrderDetail/ui/OrderDetail'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/user/login')
  }

  const order = await orderHistoryService.getOrderDetail(session.user.email, id)

  if (!order) {
    notFound()
  }

  // Using a client component for the cancel action
  // Server action is defined inline to keep the page simple
  const handleCancel = async () => {
    'use server'
    // biome-ignore lint/style/noNonNullAssertion: session is validated above
    await orderHistoryService.cancelOrder(session!.user!.email!, id)
  }

  return <OrderDetail order={order} onCancel={handleCancel} />
}
