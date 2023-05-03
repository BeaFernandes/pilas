import Roles from '@/utils/auth/Roles'
import { Role, User } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react"
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from './../../lib/prisma'

interface UserProps {
  user: User
}

export default function Admin({user}: UserProps) {
    return (
      <>
        <h2> Some super secret dashboard </h2>
        {user.name}
      
        <button onClick={() => signOut()}>Sair</button>
      </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string
    },
    include: {
      roles: true,
      admin: true,
      mayor: true,
    }
  })

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  }
}
