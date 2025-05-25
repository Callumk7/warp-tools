import { project } from "~/db/schema";
import { auth } from "~/server/utils/auth";
import { db } from "~/server/utils/db";
import { z } from "zod";

const bodySchema = z.object({
	clientId: z.string().uuid(),
	name: z.string().min(1),
	description: z.string().optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).default("IN_PROGRESS"),
	rateType: z.enum(["HOURLY", "FIXED"]).default("HOURLY"),
	rateAmount: z.number().optional(),
	currency: z.string().default("GBP"),
	notes: z.string().optional(),
});

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

		const body = await readBody(event);
		const validBody = bodySchema.parse(body);

		// Create project
		const [newProject] = await db
			.insert(project)
			.values({
				...validBody,
				userId: session.user.id,
			})
			.returning();

		return { success: true, project: newProject };
	} catch (error) {
		console.error("Error creating project:", error);
		if (error.issues) {
			throw createError({
				statusCode: 400,
				message: "Validation error",
				data: error.issues,
			});
		}
		throw createError({
			statusCode: 500,
			message: "Error creating project",
		});
	}
});