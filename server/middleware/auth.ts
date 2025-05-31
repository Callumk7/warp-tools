export default defineEventHandler(async (event) => {
	if (!event.path.startsWith("/api/auth")) {
		// Get user from session
		const session = await auth.api.getSession({ headers: event.headers });
		if (!session?.user?.id) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			});
		}

		event.context.auth = {
			user: session.user,
		};
	}
});
