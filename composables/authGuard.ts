import { useSession } from "~/lib/auth-client";

export function requireAuth() {
	const session = useSession();
	const router = useRouter();

	if (!session.value.data?.user) {
		// Redirect to login
		router.push("/login");
		throw new Error("Authentication required");
	}

	// At this point, we know user exists
	return session.value.data.user;
}
