import Head from 'next/head';
import { Card, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Product } from '@prisma/client';
import ItemsList from './_itemsList';


interface ProductsPageProps {
  products: Array<Product>
}

export default function ProductsPage({products}: ProductsPageProps) {

  return (
    <>
      <Head>
        <title>Produtos</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Title order={2} p='sm' c='#112C55'>O que vai ser hoje?</Title>

      <Card padding="xl" radius="sm" shadow='xs'>
        <ItemsList products={products}/>
        
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

  const products = await prisma?.product.findMany()

  return {
    props: {
      products,
    },
  };
};