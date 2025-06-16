import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
	baseURL: "https://warp-tools-production.up.railway.app",
});

export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } =
	authClient;
