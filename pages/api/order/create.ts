import { ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import { Order } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  user: {
    id: number,
    balance: number,
  }
  product: {
    id: number,
    price: number,
  },
  amount: number,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<Order | undefined>
) => {
  if (req.method == 'POST') {
    const { user, product, amount }: ReqProps = req.body
    const orderTotal = product.price*amount

    const errors: { [key: string]: string | Iterable<string> } = {}

    const validUser = await prisma?.user.findUnique({
      where: { id: user.id }
    })
    const validProduct = await prisma?.product.findUnique({
      where: { id: product.id }
    })

    if (!validUser) { 
      errors['userId'] = ['Usuário inválido'] 
    } else {
      const userBalance = validUser.balance ? validUser.balance : 0
      if (userBalance < orderTotal) errors['userBalance'] = ['Você vai precisar de mais Pila na conta']
    }
    if (!validProduct && !product.price) errors['productId'] = ['Produto inválido']
    if (!amount) errors['amount'] = ['Você precisa selecionar pelo menos um item']

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const order = await prisma?.order.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        product: {
          connect: {
            id: product.id,
          },
        },
        productPrice: product.price,
        amount,
      },
    })

    await prisma?.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: {
          decrement: orderTotal
        }
      }
    })

    res.status(201).json(order)
  }
}

export default withErrorHandler(handlerFunction)