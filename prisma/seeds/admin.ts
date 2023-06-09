import Roles from "../../utils/auth/Roles"


type TAdminProps = {
    ADMIN_NAME: string | undefined
    ADMIN_EMAIL: string | undefined
    ADMIN_PASSWORD: string | undefined
}
  
function getAdminProps(): TAdminProps {
    const adminProps: TAdminProps = {
        ADMIN_NAME: process.env.ADMIN_NAME,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    }
 
    for (const key in adminProps) {
        if (adminProps[key as keyof TAdminProps] === undefined) {
            throw new Error(key + ' environment variable not set on .env.')
        }
    }

    return adminProps
}

type TAdmin = {
    name: string
    email: string
    passwordHash: string
    admin: {}
    roles: {}
}

export default async function generateAdminSeed(): Promise<TAdmin> {
    const adminProps: TAdminProps = getAdminProps()

    const bcrypt = require("bcryptjs")
    const passwordHash = bcrypt.hashSync(adminProps.ADMIN_PASSWORD, 10)

    return {
        name: adminProps.ADMIN_NAME as string,
        email: adminProps.ADMIN_EMAIL as string,
        passwordHash: passwordHash,
        admin: {
            create: {},
        },
        roles: {
          connect: {
            id: Roles.ADMIN,
          },
        },
    }
}