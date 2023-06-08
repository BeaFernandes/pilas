import { List, Table, Text } from '@mantine/core';
import { Mayor, User } from "@prisma/client";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { ApiError } from '@/errors/ApiHandleError';
import axiosApi from '@/services/axiosApi';
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import moment from "moment";

export type ComposedMayor = Mayor & {
  user: User,
}

interface ItemsPageProps {
  mayors: Array<ComposedMayor>,
}
export default function ItemsList({mayors}: ItemsPageProps) {
  const [openedDrawer, setDrawerOpen] = useState(false)
  const [openedModal, setModalOpen] = useState(false)
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      department: 0,
      admin: false,
      active: false,
    },
  });

  const onDrawerOpen = (mayor: ComposedMayor) => {

    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleSubmit = async () => {
    axiosApi
      .post('/api/user/update', form.values)
      .then((res) => {
        if (res.status == 201) {
          form.reset()
          onDrawerClose()
          router.push('/admin/users')
          notifications.show({
            title: 'Uhul!',
            message: 'Usuário atualizado com sucesso.',
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

  const getMandateMonth = (mayor: ComposedMayor) => {
    const month = new Date(mayor.startOfMandate)
    console.log(month)
    console.log(month.getMonth())
  }

  return (
    <>
      <Table highlightOnHover verticalSpacing="sm" c='#343434' striped>
        <thead>
          <tr>
            <th>Prefeito</th>
            <th>Mês de exercício</th>
          </tr>
        </thead>
        <tbody>
          {mayors.map((mayor) =>
              <tr key={mayor.id} onClick={() => onDrawerOpen(mayor)}>
                <td >{mayor.user.name}</td>
                <td onClick={() => getMandateMonth(mayor)}>{moment(mayor.startOfMandate).format('MMMM')}</td>
              </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
