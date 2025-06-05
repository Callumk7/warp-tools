import { eq } from "drizzle-orm";
import { project } from "~/db/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
	try {
		const userId = getUserId(event);

		const projects = await db.query.project.findMany({
			where: eq(project.userId, userId),
			with: {
				client: true,
				invoices: true,
			},
		});

		if (projects.length === 0) {
			return [];
		}

		const projectsWithTotals = projects.map((project) => {
			const total = project.invoices.reduce(
				(acc, invoice) => acc + invoice.total,
				0,
			);
			return {
				...project,
				total,
			};
		});

		return projectsWithTotals;
	} catch (error) {
		console.error("Error fetching projects:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching projects",
		});
	}
});
