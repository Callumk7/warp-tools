import { eq } from "drizzle-orm";
import { project } from "~/db/schema";

export default defineEventHandler(async (event) => {
	if (!event.context.params || !event.context.params.id) {
		throw createError({
			statusCode: 400,
			message: 'Client ID is required'
		});
	}

	const id = event.context.params.id;
	console.log(id);

	try {
		const projectsResult = await db.query.project.findMany({
			where: eq(project.clientId, id),
			with: {
				invoices: true
			}
		})

		return projectsResult || [];
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw createError({
			statusCode: 500,
			message: 'Error fetching projects'
		})
	}
})
