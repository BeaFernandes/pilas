import { Group, Modal, Table, Text, Title, UnstyledButton } from '@mantine/core';
import { Mayor, User } from '@prisma/client';
import moment from 'moment';
import { useState } from 'react';

export type ComposedMayor = Mayor & {
  user: User,
}

interface ItemsPageProps {
  mayors: Array<ComposedMayor>,
}
export default function ItemsList({mayors}: ItemsPageProps) {
  const [openedModal, setModalOpen] = useState(false)
  const [chosenMayor, setChosenMayor] = useState<ComposedMayor>()

  const onModalOpen = (mayor: ComposedMayor) => {
    setChosenMayor(mayor)

    setModalOpen(true)
  }

  const onModalClose = () => {
    setModalOpen(false)
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
            <Modal.Header>
              <Text c='#112C55' fw='bold' size='xl'>Dados do mandato</Text>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body >
              <Title order={3} align='center'>{chosenMayor?.user.name}</Title>

              <Group position='center' my='lg'>
                <Text><Text span fw='bold'>Prefeito de: </Text>{moment(chosenMayor?.startOfMandate).format('LL')}</Text>
                <Text><Text span fw='bold'>Até: </Text>{moment(chosenMayor?.endOfMandate).format('LL')}</Text>
              </Group>
            </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Table highlightOnHover verticalSpacing='sm' c='#343434' striped>
        <thead>
          <tr>
            <th>Prefeito</th>
            <th>Mês de exercício</th>
          </tr>
        </thead>
        <tbody>
          {
            mayors?.length > 0 ?
              mayors?.map((mayor) =>
                <tr key={mayor.id}>
                  <td><UnstyledButton fz={14} c='#343434' onClick={() => onModalOpen(mayor)}>{mayor.user.name}</UnstyledButton></td>
                  <td>{moment(mayor.startOfMandate).format('MMMM')}</td>
                </tr>
              )
            :
              <tr>
                <td colSpan={2} align='center'>Ainda não há mandatos</td>
              </tr>
          }
        </tbody>
      </Table>
    </>
  )
}
