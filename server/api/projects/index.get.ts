import { eq } from "drizzle-orm";
import { project } from "~/db/schema";
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

		const projects = await db.query.project.findMany({
			where: eq(project.userId, session.user.id),
			with: {
				client: true,
				invoices: true,
			},
		});

		return projects || [];
	} catch (error) {
		console.error("Error fetching projects:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching projects",
		});
	}
});
