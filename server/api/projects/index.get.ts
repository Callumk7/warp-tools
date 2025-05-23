export default defineEventHandler(async () => {
	try {
		const projects = await db.query.project.findMany({
			with: {
				invoices: true
			}
		})

		return projects || [];
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw createError({
			statusCode: 500,
			message: 'Error fetching projects'
		})
	}
})
