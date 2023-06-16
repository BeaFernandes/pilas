import { Table, Text } from '@mantine/core';
import { Order, Product } from '@prisma/client';
import moment from 'moment';

export type ComposedOrder = Order & {
  product: Product,
}

interface TransactionsPageProps {
  orders: Array<ComposedOrder>
}

export default function ItemsList({ orders }: TransactionsPageProps) {

  return (
    <>
      <Table highlightOnHover verticalSpacing="sm" c='#343434' striped>
        <thead>
          <tr>
            <th>Data da compra</th>
            <th>Produto</th>
            <th>Valor</th>
            <th>Quantidade</th>
            <th>Total da compra</th>
          </tr>
        </thead>
        <tbody>
          {
            orders?.length > 0 ?
              orders?.map((order) =>
                <tr key={order.id}>
                  <td>
                    <Text truncate>{moment(order.createdAt).format('lll')}</Text>
                  </td>
                  <td>{order.product.name}</td>
                  <td>{`${order.productPrice} Pila`.replace('.', ',')}</td>
                  <td>{order.amount}</td>
                  <td>{`${order.amount*order.productPrice} Pila`.replace('.', ',')}</td>
                </tr>  
              )
            :
              <tr>
                <td colSpan={5} align='center'>Ainda não há transações</td>
              </tr>
          }
        </tbody>
      </Table>
    </>
  )
}
