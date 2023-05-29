import Counter from "@/components/Counter";
import { Button, Group, JsonInputProps, List, Modal, Space, Table, Text, TextInput } from "@mantine/core";
import { Order, Product } from "@prisma/client";
import { useState } from "react";
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from "@mantine/notifications";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import axiosApi from "@/services/axiosApi";

interface ProductsPageProps {
  products: Array<Product>,
  currentUser: {
    id: number,
    balance: number,
  },
}

interface FormOrder {
  user: {
    id: number,
    balance: number,
  },
  product: {
    id: number | undefined,
    price: number,
  },
  amount: number,
}

export default function ItemsList({products, currentUser}: ProductsPageProps) {
  const [openedModal, setModalOpen] = useState(false)
  const [amount, setAmount] = useState(1)
  const [chosenProduct, setChosenProduct] = useState<Product>()
  const [chosenProductPrice, setChosenProductPrice] = useState(0)
  //const [userBalance, setUserBalance] = useState(currentUser.balance)

  const form = useForm<FormOrder>({
    initialValues: {
      user: {
        id: currentUser.id,
        balance: currentUser.balance
      },
      product: {
        id: chosenProduct?.id,
        price: chosenProductPrice,
      },
      amount: amount,
    },

    validate: {
      product: {
        id: isNotEmpty('Produto inválido'),
        price: isInRange({min: 1}, 'Produto inválido'),
      },
      amount:  isInRange({min: 1}, 'Você precisa selecionar pelo menos um item'),
      user: {
        id: isNotEmpty('Usuário inválido'),
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

    //console.log(form.values)

    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
    setAmount(1)
  }

  const handleError = (errors: string | { [key: string]: string | Iterable<string> } | null) => {
    console.log('passou aqui no erro')
    notifications.show({
      title: 'Sinto muito! 🙁',
      message: (
        <List icon={ <Text color='red'><IconAlertTriangleFilled /></Text> }>
          {!form.isValid('user.id') && (
            <List.Item>
              {'Usuário inválido'}
            </List.Item>
          )}
          {!form.isValid('user.balance') && (
            <List.Item>
              {'Você vai precisar de mais Pila na conta'}
            </List.Item>
          )}
          {!form.isValid('product.id') && (
            <List.Item>
              {'Produto não encontrado'}
            </List.Item>
          )}
          {!form.isValid('amount') && (
            <List.Item>
              {'Você precisa selecionar pelo menos um item'}
            </List.Item>
          )}
        </List>
      ),
      color: "red",
    })
  }

  const handleSubmit = async () => {
    form.setValues({ 
      product: {
        id: chosenProduct?.id,
        price: chosenProductPrice,
      },
      amount: amount,
    });

    axiosApi
      .post('/api/order/create', form.values)
      .then((res) => {
        if (res.status == 201) {
          notifications.show({
            title: 'Uhul!',
            message: 'Item comprado, agora é só aproveitar',
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

    /*if(form.isValid()) {
      console.log('validou')
      try {

      } catch (error) {
        notifications.show({
          title: 'Ops! 🙁',
          message: 'Algo de errado não está certo, tente novamente mais tarde.',
          color: "red",
        })
      }
    } else {
      handleError()
    }*/

    //onModalClose()
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
                <Counter value={amount} onChange={setAmount} />
                <Button type='button' onClick={handleSubmit} variant='gradient' gradient={{from: '#4AC4F3', to: '#2399EF'}} radius='xl'>
                  <Group position='apart'>
                    <Text>Comprar</Text>
                    <Space />
                    <Text span>{amount*chosenProductPrice} Pila</Text> 
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
