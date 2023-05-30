import Counter from "@/components/Counter";
import { Button, Group, List, Modal, Space, Table, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import axiosApi from "@/services/axiosApi";
import { ApiError } from "@/errors/ApiHandleError";

interface ProductsPageProps {
  products: Array<Product>,
  currentUser: {
    id: number,
    balance: number,
  },
  onBalanceUpdate: Function
}

export default function ItemsList({products, currentUser, onBalanceUpdate}: ProductsPageProps) {
  const [openedModal, setModalOpen] = useState(false)
  const [amount, setAmount] = useState(1)
  const [chosenProduct, setChosenProduct] = useState<Product>()
  const [chosenProductPrice, setChosenProductPrice] = useState(0)
  //const [userBalance, setUserBalance] = useState(currentUser.balance)
  
  const onModalOpen = (product: Product) => {
    setChosenProduct(product)
    setChosenProductPrice(product.price)

    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
    setAmount(1)
  }

  const handleError = (errors: ApiError) => {
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

  const handleSubmit = async () => {
    const values = {
        user: {
          id: currentUser.id,
          balance: currentUser.balance
        },
        product: {
          id: chosenProduct?.id,
          price: chosenProductPrice,
        },
        amount: amount,
    }

    axiosApi
      .post('/api/order/create', values)
      .then((res) => {
        if (res.status == 201) {
          //setUserBalance(res.data.user.newBalance)
          onBalanceUpdate?.(res.data.user.newBalance)
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

    onModalClose()
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
            <Modal.Header ta='center'>
              <Text c='#112C55' fw='bold' size='xl'>{chosenProduct?.name}</Text>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body >
              <Text my='md'>Esta delícia custa <Text fw='bold' span> {chosenProduct?.price} Pila</Text></Text>

              <Group position='right'>
                <Counter value={amount} onChange={setAmount} />
                <Button type='button' onClick={() => handleSubmit()} variant='gradient' gradient={{from: '#4AC4F3', to: '#2399EF'}} radius='xl'>
                  <Group position='apart'>
                    <Text>Comprar</Text>
                    <Space />
                    <Text span>{amount*chosenProductPrice} Pila</Text> 
                  </Group>
                </Button>
              </Group>
            </Modal.Body>
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
