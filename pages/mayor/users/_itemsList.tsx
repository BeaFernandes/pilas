import { Checkbox, Drawer, Group, NumberInput, Select, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { Department, Role, User } from "@prisma/client";
import { useForm } from '@mantine/form';
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

  const departmentsData: any = departments?.map((dep) => {
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
          {
            users.length > 0 ?
              users.map((user) =>
                <tr key={user.id}>
                  <td><UnstyledButton fz={14} c='#343434' onClick={() => onDrawerOpen(user)}><Text truncate>{user.name}</Text></UnstyledButton></td>
                  <td><Text>{`${user.balance} Pila`.replace('.', ',')}</Text></td>
                  <td>{user.email}</td>
                  <td>{user.department.name}</td>
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
