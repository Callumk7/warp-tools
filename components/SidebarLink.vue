<template>
    <NuxtLink class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700" :to="to">{{ label }}</NuxtLink>
</template>

<script setup lang="ts">
interface Props {
    to: string;
    label: string;
}

const { to, label } = defineProps<Props>();
</script>
