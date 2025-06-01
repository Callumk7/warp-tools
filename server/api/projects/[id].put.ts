import { project } from "~/db/schema";
import { auth } from "~/server/utils/auth";
import { db } from "~/server/utils/db";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";

const bodySchema = z.object({
	clientId: z.string().uuid(),
	name: z.string().min(1),
	description: z.string().optional().nullable(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]),
	rateType: z.enum(["HOURLY", "FIXED", "DAILY"]),
	rateAmount: z.number().optional().nullable(),
	currency: z.string(),
	notes: z.string().optional().nullable(),
});

export default defineEventHandler(async (event) => {
	try {
		const userId = getUserId(event);

		const projectId = event.context.params?.id;
		if (!projectId) {
			throw createError({
				statusCode: 400,
				message: "Project ID is required",
			});
		}

		const body = await readBody(event);
		const validBody = bodySchema.parse(body);

		// Update project
		const [updatedProject] = await db
			.update(project)
			.set({
				...validBody,
				userId,
				updatedAt: new Date(),
			})
			.where(eq(project.id, projectId))
			.returning();

		if (!updatedProject) {
			throw createError({
				statusCode: 404,
				message: "Project not found",
			});
		}

		return { success: true, project: updatedProject };
	} catch (error: unknown) {
		console.error("Error updating project:", error);

		// Check if it's a Zod validation error
		if (error instanceof ZodError) {
			throw createError({
				statusCode: 400,
				message: "Validation error",
				data: error.issues,
			});
		}

		// Handle other types of errors
		throw createError({
			statusCode: 500,
			message: "Error updating project",
		});
	}
});
