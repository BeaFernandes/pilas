import { Button, Group, Modal, Text } from "@mantine/core";
import { Product } from "@prisma/client";
import { useState } from "react";
import Counter from "../Counter";

interface ModalBuyItemProps {
    chosenProduct: Product
    status: boolean
}
export default function ModalBuyItem({status, chosenProduct}: ModalBuyItemProps) {
    const [count, setCount] = useState(0)
    const [openedModal, setModalOpen] = useState(false)
    const [chosenProductPrice, setChosenProductPrice] = useState(0);


    const onModalClose = () => {
        setModalOpen(false)
        setCount(0)
    }

    return (
        <Modal.Root 
          opened={status} 
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
                <Button variant='gradient' gradient={{from: '#4AC4F3', to: '#2399EF'}} radius='xl'>Vou comprar</Button>
              </Group>
            </Modal.Body>

          </Modal.Content>
        </Modal.Root>
    )
}