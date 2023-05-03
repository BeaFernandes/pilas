import { GetServerSideProps } from 'next'
import { signOut, useSession } from 'next-auth/react'


export default function Mayor() {
  const { data: session } = useSession()
  
  return (
    <>
      <h2> Mayor super secret dashboard </h2>
      {session?.user?.name}

      <button onClick={() => signOut()}>Sair</button>
    </>
  )
}

Mayor.auth = {
  unauthorized: '/api/auth/signin'
}

export const getServerSideProps: GetServerSideProps = async () => {
  // get user form nextauth

  return {
    props: {
      
    },
  }
}
