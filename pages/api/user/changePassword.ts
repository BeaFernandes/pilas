import { prisma } from "@/lib/prisma";
import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  email: string,
  password: string,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) => {
  if (req.method == 'POST') {

    const { email, password }: ReqProps = req.body
    const bcrypt = require('bcryptjs')
    
    const errors: ApiError = {}

    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    if(!user){
      errors['user'] = 'Usuário inválido'
    } else {
      if (!password) errors['password'] = 'Você precisa preencher uma senha'
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const updatedUser = await prisma.user.update({
      where: {
        email, 
      },
      data: {
        passwordHash,
      },
    })

    res.status(201).json(updatedUser)
  }
}

export default withErrorHandler(handlerFunction)