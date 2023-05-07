import Roles from '../../utils/auth/Roles'

type TMayor = {
    name: string
    email: string
    passwordHash: string
    mayor: {
        create: {
            startOfMandate: Date,
            endOfMandate: Date | null,
        }
    }
    roles: {}
    department: {}
}

export default async function generateMayorsSeed() {
    const mayors: Array<TMayor> = []
    const bcrypt = require("bcryptjs")
    const passwordHash = bcrypt.hashSync("supersenha", 10)

    mayors.push({
        name: "Current Mayor",
        email: "currentmayor@mail.com",
        passwordHash: passwordHash,
        mayor: {
            create: {
                startOfMandate: new Date(),
                endOfMandate: null,
            },
        },
        roles: {
          connect: {
            id: Roles.MAYOR,
          },
        },
        department: {
            connect: {
                name: "Suporte"
            }
        }
    })
    mayors.push({
        name: "Old Mayor",
        email: "oldmayor@mail.com",
        passwordHash: passwordHash,
        mayor: {
            create: {
                startOfMandate: new Date("2023-04-01"),
                endOfMandate: new Date("2023-04-30"),
            },
        },
        roles: {},
        department: {
            connect: {
                name: "NOC"
            }
        }
    })

    return mayors
}