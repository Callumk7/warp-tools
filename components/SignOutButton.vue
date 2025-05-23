<template>
  <UButton color="secondary" variant="outline" @click="handleSignOut">Sign Out</UButton>
</template>

<script setup lang="ts">
import { signOut } from "~/lib/auth-client";

const router = useRouter();

async function handleSignOut() {
  await signOut();
  router.push("/login");
}
</script>
