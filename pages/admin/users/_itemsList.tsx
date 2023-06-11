import { Anchor, Button, Checkbox, Drawer, Group, List, Modal, PasswordInput, Select, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { Department, Role, User } from "@prisma/client";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { ApiError } from '@/errors/ApiHandleError';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import containsRole from '@/utils/auth/containsRole';
import moment from 'moment';

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
  const [openedModal, setModalOpen] = useState(false)
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      department: 0,
      admin: false,
      active: false,
      createdAt: '',
      updatedAt: '',
    },
  });

  const departmentsData: any = departments.map((dep) => {
    return {value: dep.id, label: dep.name}
  })

  const onDrawerOpen = (user: ComposedUser) => {
    form.setValues({
      name: user.name,
      email: user.email,
      department: user.departmentId,
      admin: containsRole(user, 'ADMIN'),
      active: user.active,
      createdAt: moment(user.createdAt).format('lll'),
      updatedAt: moment(user.updatedAt).format('lll'),
    })

    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleSubmit = async () => {
    axiosApi
      .post('/api/user/update', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          onDrawerClose()
          router.push('/admin/users')
          notifications.show({
            title: 'Uhul!',
            message: 'Usuário atualizado com sucesso.',
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

  const onModalOpen = () => {
    setDrawerOpen(false)
    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
    setDrawerOpen(true)
  }

  const onChangePassword = () => {
    axiosApi
      .post('/api/user/changePassword', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.setValues({
            password: '',
          })
          onModalClose()
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

  return (
    <>
      <Drawer.Root opened={openedDrawer} onClose={onDrawerClose} position='right'>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text c='#112C55' fw='bold' size='xl'>Editar usuário</Text>
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
                disabled
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
              <Text fz='sm' c='#9A9A9A' align='right'>Criado em: {form.values.createdAt}</Text>
              <Text fz='sm' c='#9A9A9A' align='right'>Última edição: {form.values.updatedAt}</Text>
              <Group position='left'>
                <Checkbox
                  label="Administrador"
                  {...form.getInputProps('admin')}
                  checked={form.values.admin} 
                  my='sm'
                />
                <Checkbox
                  label="Ativo"
                  {...form.getInputProps('active')}
                  checked={form.values.active} 
                  my='sm'
                />
              </Group>
              <Group position='apart'>
                <Anchor fz='sm' my='sm' c='#9A9A9A' onClick={() => onModalOpen()}>
                  Trocar senha
                </Anchor>
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

      <Modal 
        opened={openedModal} 
        onClose={() => onModalClose()} 
        title="Trocar senha de usuário"
        centered
      >
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
              onClick={() => onChangePassword()}
            >
              Atualizar
            </Button>
          </Group>
      </Modal>

      <Table highlightOnHover verticalSpacing="sm" c='#343434' striped>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Departamento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {
            users.length > 0 ?
              users.map((user) =>
                <tr key={user.id}>
                  <td><UnstyledButton fz={14} c='#343434' onClick={() => onDrawerOpen(user)}>{user.name}</UnstyledButton></td>
                  <td>{user.email}</td>
                  <td>{user.department.name}</td>
                  <td>{user.active? 'Ativo' : 'Inativo'}</td>
                </tr>
              )
            :
              <tr>
                <td colSpan={4} align='center'>Ainda não há usuários</td>
              </tr>
          }
        </tbody>
      </Table>
    </>
  )
}
