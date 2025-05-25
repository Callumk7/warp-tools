import { eq, sql, and, desc } from 'drizzle-orm'
import { db } from '~/server/utils/db'
import { invoice, project, client } from '~/db/schema'
import { auth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
	const session = await auth.api.getSession({ headers: event.headers })
	if (!session?.user?.id) {
		throw createError({
			statusCode: 401,
			message: 'Unauthorized'
		})
	}

	// Get invoice status counts
	const invoicesByStatus = await db
		.select({
			status: invoice.status,
			count: sql<number>`count(*)::int`
		})
		.from(invoice)
		.where(eq(invoice.userId, session.user.id))
		.groupBy(invoice.status)

	// Get top clients by total invoice amount
	const topClients = await db
		.select({
			clientName: client.name,
			totalAmount: sql<number>`sum(${invoice.total})::float`
		})
		.from(invoice)
		.innerJoin(project, eq(invoice.projectId, project.id))
		.innerJoin(client, eq(project.clientId, client.id))
		.where(eq(invoice.userId, session.user.id))
		.groupBy(client.id, client.name)
		.orderBy(sql`sum(${invoice.total}) desc`)
		.limit(10)

	// Get summary stats
	const totalInvoices = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(invoice)
		.where(eq(invoice.userId, session.user.id))

	const totalRevenue = await db
		.select({ total: sql<number>`coalesce(sum(${invoice.total}), 0)::float` })
		.from(invoice)
		.where(and(
			eq(invoice.userId, session.user.id),
			eq(invoice.status, 'PAID')
		))

	const pendingAmount = await db
		.select({ total: sql<number>`coalesce(sum(${invoice.total}), 0)::float` })
		.from(invoice)
		.where(and(
			eq(invoice.userId, session.user.id),
			sql`${invoice.status} IN ('SENT', 'PARTIALLY_PAID', 'OVERDUE')`
		))

	const activeClients = await db
		.select({ count: sql<number>`count(distinct ${project.clientId})::int` })
		.from(project)
		.where(eq(project.userId, session.user.id))

	return {
		invoicesByStatus,
		topClients,
		stats: {
			totalInvoices: totalInvoices[0]?.count || 0,
			totalRevenue: totalRevenue[0]?.total || 0,
			pendingAmount: pendingAmount[0]?.total || 0,
			activeClients: activeClients[0]?.count || 0
		}
	}
})