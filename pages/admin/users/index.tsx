import Head from 'next/head';
import { Card, Group, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import ItemsList from './_itemsList';


interface UsersPageProps {
  users: Array<User>,
}

export default function UsersPage({users}: UsersPageProps) {
  const { status } = useSession()

  if (status === "loading") return (<div>Loading...</div>)

  return (
    <>
      <Head>
        <title>Produtos</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55'>
        <Title order={2} p='sm'>Usuários</Title>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'>
        <ItemsList users={users} />
      </Card>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const users = await prisma?.user.findMany()

  return {
    props: {
        users: JSON.parse(JSON.stringify(users)),
    },
  };
};
