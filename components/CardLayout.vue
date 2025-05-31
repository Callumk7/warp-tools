<template>
	<UCard>
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl font-bold">{{ props.title }}</h2>
			<p class="text-sm">{{ props.subTitle }}</p>
			<slot />
		</div>
	</UCard>
</template>

<script setup lang="ts">
interface Props {
	title: string;
	subTitle?: string;
}

const props = defineProps<Props>();
</script>
