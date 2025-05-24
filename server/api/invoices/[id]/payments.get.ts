import { eq } from "drizzle-orm"
import { db } from "~/server/utils/db"
import { payment } from "~/db/schema"

export default defineEventHandler(async (event) => {
	const invoiceId = getRouterParam(event, 'id')
	
	if (!invoiceId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invoice ID is required'
		})
	}

	try {
		const payments = await db.query.payment.findMany({
			where: eq(payment.invoiceId, invoiceId)
		})

		return payments || []
	} catch (error) {
		console.error('Error fetching payments:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Error fetching payments'
		})
	}
})