import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
	if (to.path === "/signup" || to.path === "/login") {
		return;
	}

	const { data: session } = await authClient.useSession(useFetch);

	if (!session.value?.user) {
		if (to.path !== "/login") {
			return navigateTo("/login");
		}
	}
});
