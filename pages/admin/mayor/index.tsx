import Head from 'next/head';
import { Button, Card, Checkbox, Drawer, Group, List, PasswordInput, Select, Text, TextInput, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Department, Mayor, Role, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { IconAlertTriangleFilled, IconUserPlus, IconUserStar } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { ApiError } from '@/errors/ApiHandleError';
import { useRouter } from "next/navigation";
import ItemsList from './_itemsList';

export type ComposedMayor = Mayor & {
  user: User,
}

interface UsersPageProps {
  mayors: Array<ComposedMayor>,
}

export default function MayorPage({mayors}: UsersPageProps) {
  const router = useRouter()
  const { status } = useSession()
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      department: '',
      admin: false,
    },
  });

  const handleSubmit = async () => {
    axiosApi
      .post('/api/user/create', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          close()
          router.push('/admin/users')
          notifications.show({
            title: 'Uhul!',
            message: 'Usuário cadastrado com sucesso.',
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
        <title>Usuários</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55' p='sm'>
        <Title order={2} >Prefeito atual</Title>
        <Button 
          onClick={open} 
          fz='md' 
          variant='gradient' 
          gradient={{from: '#4AC4F3', to: '#2399EF'}} 
          radius='xl'
        >
          <Group position='apart'>
            <IconUserStar size={20}/> 
            <Text>Trocar prefeito</Text>
          </Group>
        </Button>
      </Group>
      <Card padding="xl" radius="sm" shadow='xs'>
      </Card>
      <Group position='apart' c='#112C55'>
        <Title order={2} p='sm'>Mandatos anteriores</Title>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'>
        <ItemsList mayors={mayors}/>
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

  const mayors = await prisma?.mayor.findMany({
    include: {
      user: true,
    },
    orderBy: {
      startOfMandate: 'asc',
    },
  })

  return {
    props: {
      mayors: JSON.parse(JSON.stringify(mayors)),
    },
  };
};
