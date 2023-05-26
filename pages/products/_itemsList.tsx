import Counter from "@/components/Counter";
import { Button, Group, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Product } from "@prisma/client";
import { useState } from "react";

interface ProductsPageProps {
    products: Array<Product>
  }

  
export default function ItemsList({products}: ProductsPageProps) {
  const [count, setCount] = useState(0)
  const [openedModal, { open, close }] = useDisclosure(false)
  
    return (
      <>
        <Modal 
          opened={openedModal} 
          onClose={close} 
          title='Nome do produto' 
          transitionProps={{ transition: 'slide-down' }}
          radius='lg'
          withCloseButton={false}
          centered
        >
          <Text>2 Pila</Text>
          <Group position='center'>
            <Counter value={count} onChange={setCount} />
            <Button>Põe no carrinho - {count*2} Pila</Button>
          </Group>
        </Modal>
        <Table highlightOnHover>
          <tbody>
            {products.map((product) =>
              <tr key={product.id} onClick={open}>
                <td>{product.name}</td>
                <td>{product.price} Pila</td>
              </tr>  
            )}
          </tbody>
        </Table>
      </>
    )
}
