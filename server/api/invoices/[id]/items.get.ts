import { eq } from "drizzle-orm"
import { db } from "~/server/utils/db"
import { invoiceItem } from "~/db/schema"

export default defineEventHandler(async (event) => {
	const invoiceId = getRouterParam(event, 'id')
	
	if (!invoiceId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invoice ID is required'
		})
	}

	try {
		const items = await db.query.invoiceItem.findMany({
			where: eq(invoiceItem.invoiceId, invoiceId)
		})

		return items || []
	} catch (error) {
		console.error('Error fetching invoice items:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Error fetching invoice items'
		})
	}
})