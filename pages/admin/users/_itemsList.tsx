import { Button, Card, Checkbox, Drawer, Group, List, PasswordInput, Select, Table, Text, TextInput, Title } from '@mantine/core';
import { Department, Role, User } from "@prisma/client";
import { IconAlertTriangleFilled, IconPencil } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { ApiError } from '@/errors/ApiHandleError';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Roles from '@/utils/auth/Roles';
import containsRole from '@/utils/auth/containsRole';

export type ComposedUser = User & {
  roles: Array<Role>,
  department: Department,
}

interface ProductsPageProps {
  users: Array<ComposedUser>,
  departments: Array<Department>
}

export default function ItemsList({users, departments}: ProductsPageProps) {
  const [openedDrawer, setDrawerOpen] = useState(false)
  const router = useRouter()
  //const [chosenUser, setChosenUser] = useState<ComposedUser>()

  const onDrawerOpen = (user: ComposedUser) => {
    //setChosenUser(user)

    const isAdmin = containsRole(user, 'ADMIN')
  
    
    
    form.setValues({
      name: user.name,
      email: user.email,
      password: '',
      department: user.departmentId,
      admin: containsRole(user, 'ADMIN')
    })
    //console.log(isAdmin)

    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      department: 0,
      admin: false,
    },
  });

  const departmentsData: any = departments.map((dep) => {
    return {value: dep.id, label: dep.name}
  })

  const handleSubmit = async () => {
    console.log('submit')
    console.log(form.values)

    /*axiosApi
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
      })*/
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

  return (
    <>
      <Drawer.Root opened={openedDrawer} onClose={onDrawerClose} position='right'>
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
              <Select
                withAsterisk
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
                  checked={form.values.admin}
                />
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
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Table highlightOnHover verticalSpacing="sm" striped>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            <tr key={user.id} onClick={() => onDrawerOpen(user)}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department.name}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
