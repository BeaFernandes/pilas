import { Button, Checkbox, Drawer, Group, List, NumberInput, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import { Product } from "@prisma/client";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { ApiError } from '@/errors/ApiHandleError';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import moment from 'moment';

interface ProductsPageProps {
  products: Array<Product>,
}

export default function ItemsList({products}: ProductsPageProps) {
  const [openedDrawer, setDrawerOpen] = useState(false)
  const router = useRouter()

  const form = useForm({
    initialValues: {
      id: 0,
      name: '',
      price: 0,
      amount: 0,
      active: false,
      createdAt: '',
      updatedAt: '',
    },
  });

  const onDrawerOpen = (product: Product) => {
    form.setValues({
      id: product.id,
      name: product.name,
      price: product.price,
      amount: product.amount,
      active: product.active,
      createdAt: moment(product.createdAt).format('lll'),
      updatedAt: moment(product.updatedAt).format('lll'),
    })

    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleSubmit = async () => {
    axiosApi
      .post('/api/product/update', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          onDrawerClose()
          router.push('/mayor/products')
          notifications.show({
            title: 'Uhul!',
            message: 'Produto atualizado com sucesso.',
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

  return (
    <>
      <Drawer.Root opened={openedDrawer} onClose={onDrawerClose} position='right'>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text c='#112C55' fw='bold' size='xl'>Editar produto</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <TextInput
                withAsterisk
                label="Nome do produto"
                placeholder="Nome do produto"
                {...form.getInputProps('name')}
                my='sm'
                radius='xl'
              />
              <NumberInput
                withAsterisk
                label="Preço"
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
                {...form.getInputProps('price')}
                my='sm'
                radius='xl'
              />
              <NumberInput
                withAsterisk
                defaultValue={0}
                placeholder="Quantidade"
                label="Quantidade"
                hideControls
                {...form.getInputProps('amount')}
                my='sm'
                radius='xl'
              />
              <Text fz='sm' c='#9A9A9A' align='right'>Criado em: {form.values.createdAt}</Text>
              <Text fz='sm' c='#9A9A9A' align='right'>Última edição: {form.values.updatedAt}</Text>
              <Checkbox
                label="Ativo"
                {...form.getInputProps('active')}
                checked={form.values.active} 
                my='sm'
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
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Table highlightOnHover verticalSpacing="sm" c='#343434' striped>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Estado</th>
            <th>Última edição</th>
          </tr>
        </thead>
        <tbody>
          {
            products.length > 0 ?
              products.map((product) =>
                <tr key={product.id}>
                  <td><UnstyledButton fz={14} c='#343434' onClick={() => onDrawerOpen(product)}><Text truncate>{product.name}</Text></UnstyledButton></td>
                  <td>{`${product.price} Pila`.replace('.', ',')}</td>
                  <td>{product.amount}</td>
                  <td>{product.active ? 'Ativo' : 'Inativo'}</td>
                  <td><Text truncate>{moment(product.updatedAt).format('lll')}</Text></td>
                </tr>
              )
            :
              <tr>
                <td colSpan={5} align='center'>Ainda não há produtos</td>
              </tr>
          }
        </tbody>
      </Table>
    </>
  )
}
