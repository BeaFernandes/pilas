import { PrismaClient } from '@prisma/client'
import { departments } from './seeds/departments'
import { products } from './seeds/products'
import { roles } from './seeds/roles'
import generateMayorsSeed from './seeds/mayors'
import generateAdminSeed from './seeds/admin'
import generateUsersSeed from './seeds/users'

const prisma = new PrismaClient()

async function main() {
	const adminSeed = await generateAdminSeed()
	const mayorsSeed = await generateMayorsSeed()
	const usersSeed = await generateUsersSeed(7)

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

		...mayorsSeed.map((mayor) =>
			prisma.user.upsert({
				where: {
					email: mayor.email
				},
				update: {},
				create: {
					...mayor,
				},
			})
		),

		...usersSeed.map((user) => 
			prisma.user.upsert({
				where: {
					email: user.email,
				},
				update : {},
				create: {
					...user,
				},
			})
		),

		...products.map((product) =>
			prisma.product.upsert({
				where: {
					name: product.name,
				},
				update: {},
				create: {
					...product
				},
			})
		),
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