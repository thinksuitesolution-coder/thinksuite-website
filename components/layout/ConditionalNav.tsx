'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from '@/components/ui/ChatWidget'

// Hides site Navbar, Footer, and ChatWidget on dashboard routes
export default function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <ChatWidget />}
    </>
  )
}
