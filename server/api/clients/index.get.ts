import { eq } from "drizzle-orm";
import { client } from "~/db/schema";
import { getUserId } from "~/server/utils/helpers";

export default defineEventHandler(async (event) => {
	const userId = getUserId(event);
	try {
		const clients = await db.query.client.findMany({
			where: eq(client.userId, userId),
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
