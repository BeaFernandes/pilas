import { prisma } from "@/lib/prisma";
import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  id: number,
  name: string,
  price: number,
  amount: number,
  active: boolean,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<Product | undefined>
) => {
  if (req.method == 'POST') {
    
    const { id, name, price, amount, active }: ReqProps = req.body
    
    const errors: ApiError = {}

    const productExistis = await prisma.product.findFirst({
      where: { 
        name: name,
        id: {
          not: id
        }
      }
    })

    if(productExistis){
      errors['name'] = 'Já existe um produto com esse nome'
    } else {
      if (!name) errors['name'] = 'Você precisa preencher um nome'
      if (!price) errors['price'] = 'Você precisa preencher um preço'
      if (!amount) errors['amount'] = 'Você precisa preencher uma quantidade'
    }

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        amount,
        active,
      },
    })

    res.status(201).json(product)
  }
}

export default withErrorHandler(handlerFunction)