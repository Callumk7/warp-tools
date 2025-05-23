import { db } from "~/server/utils/db";

export default defineEventHandler(async () => {
	try {
		const clients = await db.query.client.findMany({
			with: {
				projects: true,
			},
		});

		return clients || [];
	} catch (error) {
		console.error("Error fetching clients:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching clients",
		});
	}
});
