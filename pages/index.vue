<template>
  <h2>{{ user }}</h2>
</template>

<script setup lang="ts">
import { useSession } from "~/lib/auth-client";

const session = useSession();

if (!session.value) {
  navigateTo("/login");
}

const user = computed(() => session.value.data?.user);
</script>
