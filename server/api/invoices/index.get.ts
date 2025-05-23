export default defineEventHandler(async () => {
	try {
		const invoices = await db.query.invoice.findMany({
			with: {
				project: true
			}
		})

		return invoices || [];
	} catch (error) {
		console.error('Error fetching invoices:', error);
		throw createError({
			statusCode: 500,
			message: 'Error fetching invoices'
		})
	}
})
