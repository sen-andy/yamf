import { Button } from '@/components/ui/button'
import { auth, UserButton } from '@clerk/nextjs'
import { ArrowBigLeftDash, LogIn } from 'lucide-react'
import TicketForm from '@/components/TicketForm'
import Link from 'next/link'

export default async function Home() {
  const { userId } = auth()
  const isAuth = !!userId

  return (
    <main>
      <nav className='sticky bg-white top-0 left-0 h-16 w-full flex justify-between items-center'>
        <ArrowBigLeftDash />
        { isAuth ? <UserButton afterSignOutUrl='/' /> : <Link href='/sign-in'><Button>Sign In<LogIn className='h-4' /></Button></Link>}
      </nav>
      <TicketForm />
    </main>
  )
}