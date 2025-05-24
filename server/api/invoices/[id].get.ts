import { eq } from "drizzle-orm"
import { db } from "~/server/utils/db"
import { invoice } from "~/db/schema"

export default defineEventHandler(async (event) => {
	const invoiceId = getRouterParam(event, 'id')
	
	if (!invoiceId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invoice ID is required'
		})
	}

	try {
		const invoiceData = await db.query.invoice.findFirst({
			where: eq(invoice.id, invoiceId),
			with: {
				project: {
					with: {
						client: true
					}
				}
			}
		})

		if (!invoiceData) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Invoice not found'
			})
		}

		return invoiceData
	} catch (error) {
		console.error('Error fetching invoice:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Error fetching invoice'
		})
	}
})