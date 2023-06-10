import Head from 'next/head';
import { Anchor, Button, Card, Checkbox, Drawer, Group, List, PasswordInput, Select, Text, TextInput, Title } from '@mantine/core';
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
import Link from 'next/link';

export type ComposedUser = User & {
  roles: Array<Role>,
  department: Department,
}

interface UsersPageProps {
  users: Array<ComposedUser>,
  departments: Array<Department>,
}

export default function UsersPage({users, departments}: UsersPageProps) {
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

  const departmentsData: any = departments.map((dep) => {
    return {value: dep.id, label: dep.name}
  })

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
      <Drawer.Root opened={opened} onClose={close} position='right'>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text c='#112C55' fw='bold' size='xl'>Novo usuário</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <TextInput
                withAsterisk
                label="Nome"
                placeholder="Nome"
                {...form.getInputProps('name')}
                my='sm'
                radius='xl'
              />
              <TextInput
                withAsterisk
                label="Usuário / Email"
                placeholder="user@acttecnologia.com.br"
                {...form.getInputProps('email')}
                my='sm'
                radius='xl'
              />
              <PasswordInput
                withAsterisk
                label="Senha"
                placeholder="Senha"
                {...form.getInputProps('password')}
                my='sm'
                radius='xl'
              />
              <Select
                withAsterisk
                searchable
                label="Departamento"
                placeholder="Selecionar"
                {...form.getInputProps('department')}
                my='sm'
                radius='xl'
                data={departmentsData}
              />
              <Group position='apart'>
                <Checkbox
                  label="Este usuário é administrador"
                  {...form.getInputProps('admin')}
                />
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
        <title>Usuários</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55' p='sm'>
        <Title order={2}>Usuários</Title>
        <Link href='/mayor/users/balance' style={{ textDecoration: 'none' }}>
          <Button
            fz='md' 
            variant='gradient' 
            gradient={{from: '#4AC4F3', to: '#2399EF'}} 
            radius='xl'
          >
            <Text>Gerenciar saldos</Text>
          </Button>
        </Link>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'>
        <ItemsList users={users} departments={departments} />
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

  const users = await prisma?.user.findMany({
    include: {
      roles: true,
      department: true
    },
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

  const departments = await prisma?.department.findMany({})

  return {
    props: {
        users: JSON.parse(JSON.stringify(users)),
        departments,
    },
  };
};
