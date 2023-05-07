
type TUser = {
    name: string
    email: string
    passwordHash: string
    department: {}
}

export default async function generateUsersSeed(amount: number) {
    const users: Array<TUser> = []
    const bcrypt = require("bcryptjs")
    const passwordHash = bcrypt.hashSync("supersenha", 10)

    for (let i = 1; i <= amount; i++) {
        users.push({
            name: `User ${i}`,
            email: `user${i}@mail.com`,
            passwordHash: passwordHash,
            department: {
                connect: {
                    id: Math.ceil(Math.random() * 7),
                }
            }
        })
    }
    return users
}