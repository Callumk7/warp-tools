import { useSession } from "~/lib/auth-client";

export function requireAuth() {
	const session = useSession();
	const router = useRouter();

	const { data, isPending, isRefetching, error } = session.value;

	// If we're still loading or refreshing, don't make a decision yet
	if (isPending || isRefetching) {
		// Return null or undefined to indicate we're still checking
		// The calling component can handle this state appropriately
		return null;
	}

	// At this point, we've finished loading and know the authentication state
	if (!data?.user) {
		// We're certain the user isn't authenticated, redirect to login
		router.push("/login");
		return null;
	}

	// User is authenticated, return the user object
	return data.user;
}
