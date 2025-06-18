import './globals.css'
import { Header } from '@/_uiFragments/layout/Header'
import { Toaster } from 'sonner'

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <body>
        <Header />
        <div className={'container mx-auto'}>{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
