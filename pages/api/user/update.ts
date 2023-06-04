import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import Roles from "@/utils/auth/Roles";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  name: string,
  email: string,
  department: string,
  admin: boolean,
  active: boolean,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) => {
  if (req.method == 'POST') {
    
    const { name, email, department, admin, active }: ReqProps = req.body
    
    const errors: ApiError = {}

    const user = await prisma?.user.findUnique({
      where: { email: email },
      include: {
        roles: true,
      }
    })

    if(!user){
      errors['user'] = 'Usuário inválido'
    } else {
      if (!name) errors['name'] = 'Você precisa preencher um nome'
      if (!email) errors['email'] = 'Você precisa preencher um email'
      if (!department) errors['department'] = 'Você precisa escolher um departamento'
    }

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const isAdmin = () => {
      let aux = false
      user?.roles.map((role) => {
        if(role.id == Roles.ADMIN) aux = true
      })
      return aux
    }

    if(isAdmin() && !admin){
      await prisma?.user.update({
        where: {
          email,
        },
        data: {
          roles: {
            disconnect: {
              id: Roles.ADMIN,
            }
          }
        }
      })
    } else if (!isAdmin() && admin){
      await prisma?.user.update({
        where: {
          email,
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
    
    const updatedUser = await prisma?.user.update({
      where: {
        email, 
      },
      data: {
        name,
        department: {
          connect: {
            id: parseInt(department)
          }
        },
        active: active
      },
    })

    res.status(201).json(updatedUser)
  }
}

export default withErrorHandler(handlerFunction)