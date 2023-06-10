import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "../../api/auth/[...nextauth]";
import Head from "next/head";
import { Button, Card, Group, Text, Title } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import ItemsList from "./_itemsList";
import { Order, Product } from "@prisma/client";

export type ComposedOrder = Order & {
  product: Product,
}

interface TransactionsPageProps {
  orders: Array<ComposedOrder>,
  currentUser: {
    id: number,
    balance: number,
  },
}

export default function Transactions({ orders, currentUser }: TransactionsPageProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return <span>Loading...</span>;

  return (
    <>
      <Head>
        <title>Transações</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55' p='sm'>
        <Title order={2}>Transações</Title>
        <Text>
          Seu saldo:<Text fw='bold' fz='xl' span> {currentUser?.balance} Pila</Text>
        </Text>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'>
        <ItemsList orders={orders} />
      </Card>
    </>
  )
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

  const currentUser = await prisma?.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      balance: true,
    }
  })

  const orders = await prisma?.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })


  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
      currentUser,
    },
  };
};