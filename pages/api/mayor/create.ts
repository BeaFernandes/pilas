import { prisma } from "@/lib/prisma";
import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import Roles from "@/utils/auth/Roles";
import { Mayor } from "@prisma/client";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

interface ReqProps {
  user: number,
  startOfMandate: Date,
}

const handlerFunction = async (
  req: NextApiRequest,
  res: NextApiResponse<Mayor | undefined>
) => {
  if (req.method == 'POST') {

    const { user, startOfMandate }: ReqProps = req.body
    
    const errors: ApiError = {}

    if(!user) errors['user'] = 'Você precisa selecionar um usuário'
    if (!startOfMandate) errors['startOfMandate'] = 'Você precisa selecionar uma data'

    if (Object.keys(errors).length > 0) throw new ApiHandleError(400, errors)

    const oldMayor = await prisma.mayor.findFirst({
      include: {
        user: true,
      },
      where: {
        user: {
          roles: {
            some: {
              id: Roles.MAYOR
            }
          }
        },
        AND: [
          {
            endOfMandate: null
          }
        ]
      }
    })

    await prisma.mayor.update({
      where: {
        id: oldMayor?.id,
      },
      data: {
        endOfMandate: moment(startOfMandate).subtract(1, 'day').format(),
      },
    })

    await prisma.user.update({
      where: {
        id: oldMayor?.userId,
      },
      data: {
        roles: {
          disconnect: {
            id: Roles.MAYOR,
          }
        }
      },
    })

    await prisma.user.update({
      where: {
        id: user,
      },
      data: {
        roles: {
          connect: {
            id: Roles.MAYOR,
          }
        }
      },
    })

    const newMayor = await prisma.mayor.create({
      data: {
        startOfMandate: moment(startOfMandate).format(),
        user: {
          connect: {
            id: user,
          },
        },
      },
    })

    res.status(201).json(newMayor)
  }
}

export default withErrorHandler(handlerFunction)