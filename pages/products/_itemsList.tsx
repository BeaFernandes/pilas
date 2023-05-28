import Counter from "@/components/Counter";
import { Button, Group, List, Modal, Space, Table, Text, TextInput } from "@mantine/core";
import { Order, Product } from "@prisma/client";
import { useState } from "react";
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

interface ProductsPageProps {
  products: Array<Product>
}

interface FormOrder {
  user: {
    id: number | undefined,
    balance: number,
  },
  product: {
    id: number | undefined,
    price: number,
  },
  amount: number,
  //total: number,
}

export default function ItemsList({products}: ProductsPageProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(1)
  const [openedModal, setModalOpen] = useState(false)
  const [chosenProduct, setChosenProduct] = useState<Product>();
  const [chosenProductPrice, setChosenProductPrice] = useState(0);

  const form = useForm<FormOrder>({
    initialValues: {
      user: {
        id: session?.user.id,
        balance: session?.user.balance ? session?.user.balance : 0
      },
      product: {
        id: chosenProduct?.id,
        price: chosenProductPrice ? chosenProductPrice : 0,
      },
      amount: count,
      //total: 0,
    },

    validate: {
      product: {
        id: isNotEmpty('Produto inválido'),
        price: isInRange({min: 1}, 'Produto inválido'),
      },
      amount:  isInRange({min: 1}, 'Você precisa selecionar pelo menos um item'),
      user: {
        id: isNotEmpty('Usuário não encontrado'),
        balance: (value, values) => (
          value < (values.product.price*values.amount) ? 
          'Sinto muito, você vai precisar de mais Pila na conta' : 
          null
        ),
      }
    }
  });
  
  const onModalOpen = (product: Product) => {
    setChosenProduct(product)
    setChosenProductPrice(product.price)
    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
    setCount(1)
  }

  const handleError = () => {
    console.log('passou aqui no erro')
    notifications.show({
      title: 'Sinto muito! 🙁',
      message: (
        <List icon={ <Text color='red'><IconAlertTriangleFilled /></Text> }>
          {!form.isValid('user.id') && (
            <List.Item>
              {'Usuário não encontrado'}
            </List.Item>
          )}
          {!form.isValid('user.balance') && (
            <List.Item>
              {'Você vai precisar de mais Pila na conta'}
            </List.Item>
          )}
        </List>
      ),
      color: "red",
    })
  }

  const handleSubmit = () => {
    form.setValues({ 
      product: {
        id: chosenProduct?.id,
        price: chosenProduct ? chosenProduct.price : 0,
      },
      amount: count,
      /*user: {
        id: session?.user.id,
        balance: session?.user.balance ? session.user.balance : 0,
      },
      //total: chosenProduct ? chosenProduct.price * count : 0*/
    });
    console.log(form.values)

    form.validate()

    if(form.isValid()) {
      console.log('validou')
      try {
      } catch (error) {
        notifications.show({
          title: 'Ops! 🙁',
          message: 'Algo de errado não está certo, tente novamente mais tarde.',
          color: "red",
        });
      }
    } else {
      handleError()
    }

  }

  return (
    <>
      <Modal.Root 
        opened={openedModal} 
        onClose={() => onModalClose()} 
        transitionProps={{ transition: 'slide-down' }}
        radius='lg'
        centered
      >
        <Modal.Overlay />

        <Modal.Content c='#343434'>
          <form>
            <Modal.Header ta='center'>
              <Text c='#112C55' fw='bold' size='xl'>{chosenProduct?.name}</Text>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body >
              <Text my='md'>Esta delícia custa <Text fw='bold' span> {chosenProduct?.price} Pila</Text></Text>

              <Group position='right'>
                <Counter value={count} onChange={setCount} />
                <Button type='button' onClick={handleSubmit} variant='gradient' gradient={{from: '#4AC4F3', to: '#2399EF'}} radius='xl'>
                  <Group position='apart'>
                    <Text>Comprar</Text>
                    <Space />
                    <Text span>{count*chosenProductPrice} Pila</Text> 
                  </Group>
                </Button>
              </Group>
            </Modal.Body>
          </form>
        </Modal.Content>
      </Modal.Root>

      <Table highlightOnHover verticalSpacing="sm" striped>
        <tbody>
          {products.map((product) =>
            <tr key={product.id} onClick={() => onModalOpen(product)}>
              <td>{product.name}</td>
              <td>{product.price} Pila</td>
            </tr>  
          )}
        </tbody>
      </Table>
    </>
  )
}
