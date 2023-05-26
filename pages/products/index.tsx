import Head from 'next/head';
import { Button, Card, Drawer, Group, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Product } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { IconShoppingCart } from '@tabler/icons-react';
import ItemsList from './_itemsList';


interface ProductsPageProps {
  products: Array<Product>
}

export default function ProductsPage({products}: ProductsPageProps) {
  const [openedModal, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={openedModal} onClose={close} title="Carrinho" position='right'>
        {/* Drawer content */}
      </Drawer>

      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Group position='apart'>
        <Title order={2} p='sm'>O que vai ser hoje?</Title>
        <Button onClick={open}>
          <Group position='apart'>
            <IconShoppingCart size={22}/>
            <Text size={18}>Carrinho</Text>
          </Group>
        </Button>
      </Group>

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
