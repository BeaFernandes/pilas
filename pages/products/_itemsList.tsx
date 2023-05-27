import Counter from "@/components/Counter";
import { Button, Group, Modal, Table, Text } from "@mantine/core";
import { Order, Product } from "@prisma/client";
import { useState } from "react";

interface ProductsPageProps {
  products: Array<Product>
}

export default function ItemsList({products}: ProductsPageProps) {
  const [count, setCount] = useState(0)
  const [openedModal, setModalOpen] = useState(false)
  const [chosenProduct, setChosenProduct] = useState<Product>();
  const [chosenProductPrice, setChosenProductPrice] = useState(0);

  const onModalOpen = (chosenProduct: Product) => {
    setChosenProduct(chosenProduct)
    setChosenProductPrice(chosenProduct.price)
    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
    setCount(0)
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

          <Modal.Body>
            <Group position='apart' my='md'>
              <Text>Essa delícia custa <Text fw='bold' span> {chosenProduct?.price} Pila</Text></Text>
              <Text>Total <Text fw='bold' span> {count*chosenProductPrice} Pila</Text></Text>
            </Group>

            <Group position='right'>
              <Counter value={count} onChange={setCount} />
              <Button variant='gradient' gradient={{from: '#4AC4F3', to: '#2399EF'}} radius='xl'>Comprar</Button>
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
