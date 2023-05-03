import { PrismaClient } from '@prisma/client'
import getAdminSeed from './seeds/admin'
import { departments } from './seeds/departments'
import { roles } from './seeds/roles'

const prisma = new PrismaClient()

async function main() {
	const adminSeed = await getAdminSeed()

	/*const admin = await prisma.user.upsert({
			where: {
					email: adminSeed.email
			},
			update: {},
			create: {
					...adminSeed,
			},
	})*/

	await prisma.$transaction([
		...departments.map((department) =>
			prisma.department.upsert({
				where: {
					name: department.name,
				},
				update: {},
				create: {
					...department
				}
			})
		),


		...roles.map((role) =>
      prisma.role.upsert({
        where: {
          id: role.id,
        },
        update: {},
        create: {
          ...role,
        },
      })
	  ),

		prisma.user.upsert({
			where: {
				email: adminSeed.email
			},
			update: {},
			create: {
				...adminSeed,
				department: {
					connect: {
						name: 'Gestão'
					}
				}
			},
		}),
	])
}

main()
.then(async () => {
		await prisma.$disconnect()
})
.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
})