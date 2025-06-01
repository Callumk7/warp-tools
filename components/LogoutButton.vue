<script setup lang="ts">
import { signOut } from "~/lib/auth-client";

const handleLogout = async () => {
	const router = useRouter();
	await signOut();
	router.push("/login");
};
</script>

<template>
	<UButton color="neutral" variant="outline" @click="handleLogout">Logout</UButton>
</template>
