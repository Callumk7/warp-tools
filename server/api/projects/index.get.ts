export default defineEventHandler(async (event) => {
	try {
		const projects = await db.query.projects.findMany({
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
