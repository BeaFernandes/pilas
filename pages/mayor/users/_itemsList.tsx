import { Anchor, Button, Checkbox, Container, Drawer, Group, List, Modal, NumberInput, PasswordInput, Select, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { Department, Role, User } from "@prisma/client";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { ApiError } from '@/errors/ApiHandleError';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import containsRole from '@/utils/auth/containsRole';
import { useDisclosure } from '@mantine/hooks';
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
      balance: 0,
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
      balance: user.balance,
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
              <Text c='#112C55' fw='bold' size='xl'>Informaçẽos do usuário</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
              <TextInput
                label="Nome"
                placeholder="Nome"
                {...form.getInputProps('name')}
                my='sm'
                radius='xl'
                readOnly
              />
              <TextInput
                label="Usuário / Email"
                placeholder="user@acttecnologia.com.br"
                {...form.getInputProps('email')}
                my='sm'
                radius='xl'
                readOnly
              />
              <Select
                searchable
                label="Departamento"
                placeholder="Selecionar"
                {...form.getInputProps('department')}
                my='sm'
                radius='xl'
                data={departmentsData}
                readOnly
              />
              <NumberInput
                label="Saldo"
                defaultValue={form.values.balance}
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
                my='sm'
                radius='xl'
                readOnly
              />
              <Text fz='sm' c='#9A9A9A' align='right'>Criado em: {form.values.createdAt}</Text>
              <Text fz='sm' c='#9A9A9A' align='right'>Última edição: {form.values.updatedAt}</Text>
              <Group position='left'>
                <Checkbox
                  label="Administrador"
                  checked={form.values.admin} 
                  my='sm'
                  readOnly
                />
                <Checkbox
                  label="Ativo"
                  checked={form.values.active} 
                  my='sm'
                />
              </Group>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Table highlightOnHover verticalSpacing="sm" c='#343434' striped>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Saldo em Pilas</th>
            <th>E-mail</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
              <tr key={user.id}>
                <td><UnstyledButton fz={14} c='#343434' onClick={() => onDrawerOpen(user)}><Text truncate>{user.name}</Text></UnstyledButton></td>
                <td><Text>{`${user.balance} Pila`.replace('.', ',')}</Text></td>
                <td>{user.email}</td>
                <td>{user.department.name}</td>
              </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
