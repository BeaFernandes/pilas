import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import Roles from "@/utils/auth/Roles";
import { Product, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  name: string,
  price: number,
  amount: number,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<Product | undefined>
) => {
  if (req.method == 'POST') {

    const { name, price, amount }: ReqProps = req.body
    
    const errors: ApiError = {}

    const productExistis = await prisma?.product.findFirst({
      where: { 
        name: name
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

    const product = await prisma?.product.create({
      data: {
        name,
        price,
        amount,
      },
    })

    res.status(201).json(product)
  }
}

export default withErrorHandler(handlerFunction)