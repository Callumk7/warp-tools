export default defineEventHandler(async (event) => {
	try {
		const invoices = await db.query.invoices.findMany({
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
