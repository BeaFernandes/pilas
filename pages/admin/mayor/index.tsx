import Head from 'next/head';
import { Alert, Button, Card, Drawer, Group, List, Select, Text, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Mayor, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { IconAlertTriangleFilled, IconUserStar } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import axiosApi from '@/services/axiosApi';
import { notifications } from '@mantine/notifications';
import { ApiError } from '@/errors/ApiHandleError';
import { useRouter } from 'next/navigation';
import ItemsList from './_itemsList';
import CurrentMayor from '@/components/CurrentMayor';
import { IconAlertCircle } from '@tabler/icons-react';

export type ComposedMayor = Mayor & {
  user: User,
}

interface UsersPageProps {
  mayors: Array<ComposedMayor>,
  currentMayor: ComposedMayor,
  users: Array<User>,
}

export default function MayorPage({mayors, currentMayor, users}: UsersPageProps) {
  const router = useRouter()
  const { status } = useSession()
  const [opened, { open, close }] = useDisclosure(false)
  const form = useForm({
    initialValues: {
      user: '',
      startOfMandate: '',
    },
  });

  const usersData: any = users.map((user) => {
    return {value: user.id, label: user.name}
  })

  const handleSubmit = async () => {
    axiosApi
      .post('/api/mayor/create', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          close()
          router.push('/admin/mayor')
          notifications.show({
            title: 'Uhul!',
            message: 'Prefeito alterado com sucesso',
            color: 'green',
          })
        } else {
          notifications.show({
            title: 'Ops! 🙁',
            message: 'Algo de errado não está certo, tente novamente mais tarde.',
            color: 'red',
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
      color: 'red',
    })
  }

  if (status === 'loading') return (<div>Loading...</div>)

  return (
    <>
      <Drawer.Root opened={opened} onClose={close} position='right'>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text c='#112C55' fw='bold' size='xl'>Novo prefeito</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <Select
                withAsterisk
                searchable
                label='Usuário'
                placeholder='Selecionar'
                {...form.getInputProps('user')}
                my='sm'
                radius='xl'
                data={usersData}
              />
              <DateInput
                withAsterisk
                label='Início do mandato'
                placeholder='00/00/0000'
                valueFormat='DD/MM/YYYY'
                {...form.getInputProps('startOfMandate')}
                maw={400}
                mx='auto'
                my='sm'
                radius='xl'
              />
              <Group position='right'>
                <Button 
                  fz='md' 
                  variant='gradient' 
                  gradient={{from: '#4AC4F3', to: '#2399EF'}} 
                  radius='xl'
                  my='sm'
                  type='submit'
                >
                  Cadastrar
                </Button>
              </Group>
            </form>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Head>
        <title>Prefeitos</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
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

      <Card padding='xl' radius='sm' shadow='xs' c='#343434'>
        <CurrentMayor currentMayor={currentMayor} />
      </Card>

      <Group position='apart' c='#112C55'>
        <Title order={2} p='sm'>Mandatos anteriores</Title>
      </Group>

      <Card padding='xl' radius='sm' shadow='xs'>
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
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  
  const currentMayor = await prisma?.mayor.findFirst({
    include: {
      user: true,
    },
    where: {
      endOfMandate: null,
    },
  })

  const mayors = await prisma?.mayor.findMany({
    include: {
      user: true,
    },
    orderBy: {
      startOfMandate: 'desc',
    },
    where: {
      id: {
        not: currentMayor?.id,
      },
    },
  })

  const users = await prisma?.user.findMany({
    orderBy: {
      name: 'asc',
    },
    where: {
      active: true,
    },
  })


  return {
    props: {
      mayors: JSON.parse(JSON.stringify(mayors)),
      currentMayor: JSON.parse(JSON.stringify(currentMayor)),
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};
