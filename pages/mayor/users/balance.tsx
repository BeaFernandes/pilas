import Head from 'next/head';
import { Button, Card, Checkbox, Drawer, Group, List, NumberInput, PasswordInput, Select, Text, TextInput, Title, TransferList, TransferListData } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Department, Role, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { IconAlertTriangleFilled, IconUserPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import ItemsList from './_itemsList';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { ApiError } from '@/errors/ApiHandleError';
import { useRouter } from "next/navigation";
import { useState } from 'react';

interface UsersPageProps {
  users: Array<User>,
}

export default function BalancePage({users}: UsersPageProps) {
  const router = useRouter()
  const { status } = useSession()

  const usersData = users.map((user) => {
    return {value: user.email, label: user.name}
  })

  const initialValues: TransferListData = [
    usersData,
    [],
  ];
  
  const [data, setData] = useState<TransferListData>(initialValues);

  const form = useForm({
    initialValues: {
      users: data,
      balance: 0,
    },
  });


  const handleSubmit = async () => {
    axiosApi
      .post('/api/user/assignPilas', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          router.push('/mayor/users/balance')
          notifications.show({
            title: 'Uhul!',
            message: 'Pilas atribuídos com sucesso.',
            color: "green",
          })
        } else {
          notifications.show({
            title: 'Ops! 🙁',
            message: 'Algo de errado não está certo, tente novamente mais tarde.',
            color: "red",
          })
        }
      })
      .catch((e) => {
        if (e.response.data.data) {
          handleError(e.response.data.data)
        }
      })
  }

  const handleError = (errors: ApiError) => {
    form.setErrors(errors)
    notifications.show({
      title: 'Sinto muito! 🙁',
      message: (
        <List icon={ <Text color='red'><IconAlertTriangleFilled /></Text> }>
          {Object.keys(errors).map((key) => {
            return (
              <List.Item key={key}>
                {errors[key]}
              </List.Item>
            )
          })}
        </List>
      ),
      color: "red",
    })
  }

  if (status === "loading") return (<div>Loading...</div>)

  return (
    <>
      <Head>
        <title>Pilas</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55' p='sm'>
        <Title order={2}>Pilas</Title>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'>
        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <TransferList
            searchPlaceholder="Procurar..."
            nothingFound="Nenhum usuário aqui"
            titles={['Usuários disponíveis', 'Atribuir Pilas para...']}
            breakpoint="sm"
            {...form.getInputProps('users')}
          />

          <Group position='right' my='md'>
            <NumberInput
              defaultValue={0}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `${value} Pila`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                  : ' Pila'
              }
              hideControls
              decimalSeparator=","
              precision={2}
              step={0.25}
              {...form.getInputProps('balance')}
              radius='xl'
            />
            <Button 
              fz='md' 
              variant='gradient' 
              gradient={{from: '#4AC4F3', to: '#2399EF'}} 
              radius='xl'
              type='submit'
            >
              Atribuir
            </Button>
          </Group>
        </form>
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
    }
  }

  const users = await prisma?.user.findMany({
    where: {
      active: true,
      name: {
        not: 'admin',
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return {
    props: {
        users: JSON.parse(JSON.stringify(users)),
    },
  };
};
