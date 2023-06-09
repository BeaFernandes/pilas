import { ApiError, ApiHandleError } from "@/errors/ApiHandleError";
import withErrorHandler from "@/utils/api/withErrorHandler";
import { Mayor, User } from "@prisma/client";
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

    const oldMayor = await prisma?.mayor.findFirst({
      where: {
        endOfMandate: null,
      }
    })

    await prisma?.mayor.update({
      where: {
        id: oldMayor?.id,
      },
      data: {
        endOfMandate: moment(startOfMandate).subtract(1, 'day').format()
      },
    })

    const newMayor = await prisma?.mayor.create({
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