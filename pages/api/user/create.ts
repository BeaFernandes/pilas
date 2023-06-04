import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import Roles from "@/utils/auth/Roles";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  name: string,
  email: string,
  password: string,
  department: string,
  admin: boolean,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) => {
  if (req.method == 'POST') {
    const { name, email, password, department, admin }: ReqProps = req.body
    const bcrypt = require('bcryptjs')
    const passwordHash = bcrypt.hashSync(password, 10)
    
    const errors: ApiError = {}

    const userExistis = await prisma?.user.findUnique({
      where: { email: email }
    })

    if(userExistis){
      errors['user'] = 'Este usuário já está cadastrado'
    } else {
      if (!name) errors['name'] = 'Você precisa preencher um nome'
      if (!email) errors['email'] = 'Email inválido'
      if (!password) errors['password'] = 'Você precisa preencher uma senha'
      if (!department) errors['department'] = 'Você precisa escolher um departamento'
    }

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const user = await prisma?.user.create({
      data: {
        name,
        email,
        passwordHash: passwordHash,
        department: {
          connect: {
            id: parseInt(department)
          }
        }
      },
    })

    if(admin){
      await prisma?.user.update({
        where: {
          id: user?.id,
        },
        data: {
          roles: {
            connect: {
              id: Roles.ADMIN,
            }
          }
        }
      })
    }

    res.status(201).json(user)
  }
}

export default withErrorHandler(handlerFunction)