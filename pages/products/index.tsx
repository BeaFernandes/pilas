import Head from 'next/head';
import { Card, Table, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Product } from '@prisma/client';
import Counter from '@/components/Counter';
import { useState } from 'react';


interface ProductsPageProps {
  products: Array<Product>
}

export default function ProductsPage({products}: ProductsPageProps) {
  const [count, setCount] = useState(0);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Title order={2} p='sm'>O que vai ser hoje?</Title>

      <Card padding="xl" radius="sm" shadow='xs'>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Item</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) =>
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <Counter value={count} onChange={setCount}/>
                </td>  
                <td>Coloca no carrinho</td>
              </tr>  
            )}
          </tbody>
        </Table>
        
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
