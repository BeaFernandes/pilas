import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import Layout from "@/components/Layout";
import { Button, Card, Flex, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import CurrentMayor from "@/components/CurrentMayor";
import { Mayor, User } from "@prisma/client";
import Roles from "@/utils/auth/Roles";

export type ComposedMayor = Mayor & {
  user: User,
}

interface HomePageProps {
  currentMayor: ComposedMayor,
}

export default function Home({ currentMayor }: HomePageProps) {
  const { data: session, status } = useSession()

  if (status === "loading") return <span>Loading...</span>

  return (
    <>
      <Layout title='Início' activeLink='/'>
        <Group position='apart' c='#112C55' p='sm'>
          <Title order={2}>Actiano, seja bem-vindo ao sistema dos Pila</Title>
        </Group>

        <Card padding="xl" radius="sm" shadow='xs' c='#343434'>
          <Flex
              gap='lg'
              justify='center'
              align='center'
              direction='column'
              wrap='wrap'
            >
            <Text fz='sm' align='center'>Vá em <Text fw='bold' span>Comprar</Text> para adquirir uma guloseima</Text>
            <Link href='/products'>
              <Button 
                fz='md' 
                variant='gradient' 
                gradient={{from: '#4AC4F3', to: '#2399EF'}} 
                radius='xl'
                my='sm'
                type='submit'
              >
                Ou clique aqui
              </Button>
            </Link>
          </Flex>

        </Card>

        <Group position='apart' c='#112C55' p='sm'>
          <Title order={2} >Esse é nosso atual prefeito</Title>
        </Group>

        <Card padding='xl' radius='sm' shadow='xs' c='#343434'>
          <CurrentMayor currentMayor={currentMayor} />
        </Card>
      </Layout>
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

  const currentMayor = await prisma.mayor.findFirst({
    include: {
      user: true,
    },
    where: {
      user: {
        roles: {
          some: {
            id: Roles.MAYOR
          }
        }
      }
    },
  })

  return {
    props: {
      currentMayor: JSON.parse(JSON.stringify(currentMayor)),
    },
  };
};