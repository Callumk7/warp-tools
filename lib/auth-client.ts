import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
	baseURL: "https://warp-tools-production-3036.up.railway.app",
});

export const { signIn, signOut, signUp, useSession, forgetPassword, resetPassword } =
	authClient;
