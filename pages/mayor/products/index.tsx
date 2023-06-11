import { Button, Card, Drawer, Group, List, NumberInput, Select, Text, Title } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Product } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { IconAlertTriangleFilled, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import ItemsList from './_itemsList';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { ApiError } from '@/errors/ApiHandleError';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Layout from '@/components/Layout';

interface ProductsPageProps {
  products: Array<Product>,
}

export default function ProductsPage({products}: ProductsPageProps) {
  const router = useRouter()
  const { status } = useSession()
  const [opened, { open, close }] = useDisclosure(false)
  
  const productsDataOrigin = products.map((product) => {
    return {value: product.name, label: product.name}
  })

  const [productsData, setProductsData] = useState(productsDataOrigin)

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      amount: 0,
    },
  });

  const handleSubmit = async () => {
    axiosApi
      .post('/api/product/create', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          close()
          router.push('/mayor/products')
          notifications.show({
            title: 'Uhul!',
            message: 'Produto cadastrado com sucesso.',
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
    setProductsData(productsDataOrigin)
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
              <Text c='#112C55' fw='bold' size='xl'>Novo produto</Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <Select
                withAsterisk
                label="Nome do produto"
                data={productsData}
                placeholder="Nome do produto"
                {...form.getInputProps('name')}
                searchable
                creatable
                allowDeselect
                rightSection
                getCreateLabel={(query) => `+ Criar ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query }
                  setProductsData((current) => [...current, item])
                  return item
                }}
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

      <Layout title='Produtos' activeLink='/mayor/products'>
        <Group position='apart' c='#112C55' p='sm'>
          <Title order={2}>Produtos</Title>
          <Button 
            onClick={open} 
            fz='md' 
            variant='gradient' 
            gradient={{from: '#4AC4F3', to: '#2399EF'}} 
            radius='xl'
          >
            <Group position='apart'>
              <IconPlus size={20}/> 
              <Text>Novo</Text>
            </Group>
          </Button>
        </Group>

        <Card padding="xl" radius="sm" shadow='xs'>
          <ItemsList products={products} />
        </Card>
      </Layout>
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
    }
  }

  const products = await prisma?.product.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return {
    props: {
        products: JSON.parse(JSON.stringify(products)),
    },
  }
}
