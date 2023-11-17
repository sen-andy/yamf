import { cookies } from 'next/headers'
import JamfAuth from '@/components/JamfAuth'
import TicketTable from '@/components/TicketTable'

type Props = {}

export default (props: Props) => {
  const cookieStore = cookies()
  const token = cookieStore.get("jamf_token")?.value;
  const expireDate = cookieStore.get("jamf_expires")?.value;

  
 
  const checkToken = () => {
    return !!token && !!expireDate && Number(expireDate) > Date.now()
  }

  return (
    <>
    <div className='container'>
      <JamfAuth hasToken={ checkToken() } />
      <TicketTable />
    </div>
    </>
  )
}