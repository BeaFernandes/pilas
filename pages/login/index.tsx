import { prisma } from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { signIn, useSession } from "next-auth/react";
import { Button, Card, Flex, Group, Image, List, PasswordInput, Text, TextInput, em } from "@mantine/core";
import Roles from "@/utils/auth/Roles";
//import useStyles from "./styles";
import { isNotEmpty, useForm } from "@mantine/form";
import { ApiError } from '@/errors/ApiHandleError';
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()
  //const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: isNotEmpty('Você precisa preencher um e-mail'),
      password: isNotEmpty('Você precisa preencher uma senha'),
    }
  });

  const handleSubmit = async () => {
    const email = form.values.email
    const password = form.values.password

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })


    if(res?.error) {
      handleError({
        login: 'Credenciais inválidas', 
      })
      return
    }

    router.push('/')
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

  if (status === "loading") return <span>Loading...</span>

  return (
    <div>
        <Flex 
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          bg='#f8f9fa'
          h='100vh'
          sx={{overflowY: 'hidden'}}>
          <Card 
            padding='xl' 
            radius='lg' 
            shadow='xs' 
            w={400}
            sx={{
              [`@media (max-width: ${em(420)})`]: {
                width: 350,
              },

              [`@media (max-width: ${em(320)})`]: {
                width: 280,
              },
            }}
          >
            <Group position='center'>
              <Image maw={100} src="/Logo.png" alt="Logo da Act" withPlaceholder/>
            </Group>
            <form  onSubmit={form.onSubmit(() => handleSubmit())}>
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
                my='sm'
                radius='xl'
                {...form.getInputProps('password')}
              />
              <Group position='center'>
                <Button 
                  fz='md' 
                  variant='gradient' 
                  gradient={{from: '#4AC4F3', to: '#2399EF'}} 
                  radius='xl'
                  my='sm'
                  type='submit'
                >
                  Fazer login
                </Button>
              </Group>
            </form>
          </Card>
        </Flex>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

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