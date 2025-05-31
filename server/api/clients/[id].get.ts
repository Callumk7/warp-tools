import { client } from "~/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) {
		throw createError({
			statusCode: 400,
			message: "Client ID is required",
		});
	}

	try {
		const clientResult = await db.query.client.findFirst({
			where: eq(client.id, id),
			with: {
				projects: true,
				invoices: true,
			},
		});

		if (!clientResult) {
			throw createError({
				statusCode: 404,
				message: "Client not found",
			});
		}

		return clientResult;
	} catch (error) {
		console.error(`Error fetching client ${id}:`, error);
		throw createError({
			statusCode: 500,
			message: "Error fetching client",
		});
	}
});
