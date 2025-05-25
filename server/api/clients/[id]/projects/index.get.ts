import { eq, and } from "drizzle-orm";
import { project, client } from "~/db/schema";
import { auth } from "~/server/utils/auth";
import { db } from "~/server/utils/db";

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

		const clientId = getRouterParam(event, "id");
		if (!clientId) {
			throw createError({
				statusCode: 400,
				message: "Client ID is required",
			});
		}

		// Get projects for the specific client, filtered by authenticated user
		const projects = await db.query.project.findMany({
			where: and(
				eq(project.clientId, clientId),
				eq(project.userId, session.user.id)
			),
			with: {
				client: true,
			},
		});

		return projects || [];
	} catch (error) {
		console.error("Error fetching client projects:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching client projects",
		});
	}
});