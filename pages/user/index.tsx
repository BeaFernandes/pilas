import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { Department, Role, User } from "@prisma/client";
import Head from "next/head";
import { Anchor, Avatar, Button, Card, Divider, Flex, Group, List, Modal, MultiSelect, PasswordInput, Text, Title } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import axiosApi from "@/services/axiosApi";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ApiError } from "@/errors/ApiHandleError";

export type ComposedUser = User & {
  department: Department,
  roles: Array<Role>
}

interface UserPageProps {
  currentUser: ComposedUser,
}

export default function UserPage({ currentUser }: UserPageProps) {
  const { data: session, status } = useSession()
  const [opened, { open, close }] = useDisclosure(false);
  const { roles } = currentUser;
  const form = useForm({
    initialValues: {
      email: currentUser?.email,
      password: '',
    },
  });

  const rolesData = roles.map((role) => {
    return role.title
  })

  const handleSubmit = async () => {
    axiosApi
      .post('/api/user/changePassword', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.setValues({
            password: '',
          })
          close()
          notifications.show({
            title: 'Uhul!',
            message: 'Senha atualizada com sucesso.',
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

  if (status === "loading") return <div>Loading...</div>;

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={() => close()} 
        title="Trocar senha de usuário"
        centered
      >
        <form  onSubmit={form.onSubmit(() => handleSubmit())}>
          <PasswordInput
            withAsterisk
            label="Nova senha"
            placeholder="Senha"
            my='sm'
            radius='xl'
            {...form.getInputProps('password')}
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
              Atualizar
            </Button>
          </Group>
        </form>
      </Modal>
      <Head>
        <title>Meu perfil</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Group position='apart' c='#112C55' p='sm'>
        <Title order={2}>Meu perfil</Title>
      </Group>

      <Card padding="xl" radius="sm" shadow='xs'  c='#343434'>
        <Flex
          mih={50}
          gap='xl'
          justify='flex-start'
          align='center'
          direction='column'
          wrap='wrap'
        >
          <Avatar color='blue' radius='xl' size='lg'>
            <IconUser size='2rem' />
          </Avatar>
          <Title order={3}>{currentUser?.name}</Title>
        </Flex>

        <Divider my='lg'/>

        <Group position='apart' align='end' m='lg'>
          <Flex
            gap='sm'
            justify='flex-start'
            align='flex-start'
            direction='column'
            wrap='wrap'
          >
            <Title order={3}>{currentUser?.department.name}</Title>
            <Text><Text fw='bold' span>E-mail: </Text>{currentUser?.email}</Text>
            <Text><Text fw='bold' span>Saldo em pilas: </Text>{`${currentUser.balance} Pila`.replace('.', ',')}</Text>
          </Flex>

          <Anchor fz='sm' c='#9A9A9A' onClick={() => open()} td='underline'>
            Trocar senha
          </Anchor>
        </Group>

        <MultiSelect 
          label='Papéis' 
          defaultValue={rolesData} 
          data={rolesData} 
          placeholder="Nenhum papel..."
          readOnly
          radius='xl'
          m='lg'
          sx={roles.length <= 0 ? {display: 'none'} : {display: 'block'}} 
        />
        
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
  // Destination with callback URL: `/api/auth/signin?error=SessionRequired&callbackUrl=${process.env.NEXTAUTH_URL}admin`

  const currentUser = await prisma?.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      department: true,
      roles: true,
    },
  })

  return {
    props: {
      currentUser: JSON.parse(JSON.stringify(currentUser)),
    },
  };
};
