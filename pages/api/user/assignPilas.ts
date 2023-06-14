import { prisma } from "@/lib/prisma";
import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import { TransferListData } from "@mantine/core";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  users: TransferListData,
  balance: number,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<string | undefined>
) => {
  if (req.method == 'POST') {
    
    const { users, balance }: ReqProps = req.body
    
    const errors: ApiError = {}

    if(users[1].length <= 0) errors['users'] = 'Você precisa selecionar pelo menos um usuário'
    if (!balance) errors['balance'] = 'Você precisa preencher um valor em Pilas'

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)
    
    users[1].map(async (user) => 
      await prisma.user.update({
        where: {
          email: user.value, 
        },
        data: {
          balance: {
            increment: balance,
          },
        },
      })
    )

    
  
    
    res.status(201).json('')
  }
}

export default withErrorHandler(handlerFunction)