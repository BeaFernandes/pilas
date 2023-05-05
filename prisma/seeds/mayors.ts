import Roles from '../../utils/auth/Roles'

type TMayor = {
    name: string
    email: string
    passwordHash: string
    mayor: {
        create: {
            startOfMandate: Date,
        }
    }
    roles: {}
}

export default async function getMayorSeed(): Promise<TMayor> {

    const bcrypt = require("bcryptjs")
    const passwordHash = bcrypt.hashSync("supersenha", 10)



    return {
        name: "User 1",
        email: "user1@mail.com",
        passwordHash: passwordHash,
        mayor: {
            create: {
                startOfMandate: new Date(),
            },
        },
        roles: {
          connect: {
            id: Roles.MAYOR,
          },
        },
    }
}