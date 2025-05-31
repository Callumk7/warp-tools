import { project, client } from "~/db/schema";
import { auth } from "~/server/utils/auth";
import { db } from "~/server/utils/db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	try {
		// Get user from session
		const session = await auth.api.getSession({ headers: event.headers });
		if (!session?.user?.id) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			});
		}

		const projectId = event.context.params?.id;
		if (!projectId) {
			throw createError({
				statusCode: 400,
				message: "Project ID is required",
			});
		}

		// Get project with client information
		const projectData = await db
			.select({
				id: project.id,
				name: project.name,
				clientId: project.clientId,
				description: project.description,
				startDate: project.startDate,
				endDate: project.endDate,
				status: project.status,
				rateType: project.rateType,
				rateAmount: project.rateAmount,
				currency: project.currency,
				notes: project.notes,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
				client: {
					id: client.id,
					name: client.name,
				},
			})
			.from(project)
			.leftJoin(client, eq(project.clientId, client.id))
			.where(eq(project.id, projectId))
			.limit(1);

		if (!projectData.length) {
			throw createError({
				statusCode: 404,
				message: "Project not found",
			});
		}

		return projectData[0];
	} catch (error: unknown) {
		console.error("Error fetching project:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching project",
		});
	}
});
