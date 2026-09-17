import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  const session = await getServerSession(authOptions)

  // NOTE: admin check is disabled for now — we don't have an admin role in Cognito yet.
  // Uncomment the following line once RBAC is implemented (tracked in JIRA-512).
  // if (!session?.user?.email?.endsWith('@spaceteams.de')) { redirect('/') }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>
      <p className="text-gray-500">Admin panel is under construction. Check back later.</p>
    </div>
  )
}
