import { prisma } from "@/lib/prisma";
import { Card, Group, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Product } from '@prisma/client';
import ItemsList from './_itemsList';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';


interface ProductsPageProps {
  products: Array<Product>,
  currentUser: {
    id: number,
    balance: number,
  },
}

export default function ProductsPage({products, currentUser}: ProductsPageProps) {
  const { status } = useSession()

  if (status === "loading") return (<div>Loading...</div>)

  return (
    <>
      <Layout title='Produtos' activeLink='/products'>
        <Group position='apart' c='#112C55' p='sm'>
          <Title order={2}>O que vai ser hoje?</Title>
          <Text>
            Seu saldo: <Text fw='bold' fz='xl' span>{`${currentUser.balance} Pila`.replace('.', ',')}</Text>
          </Text>
        </Group>

        <Card padding="xl" radius="sm" shadow='xs'>
          <ItemsList products={products} currentUser={currentUser} />
        </Card>
      </Layout>
      
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

  const products = await prisma.product.findMany({
    where: {
      amount: {
        gt: 0,
      },
      active: true,
    }
  })
  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      balance: true,
    }
  })

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      currentUser,
    },
  };
};
