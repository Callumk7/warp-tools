<script setup lang="ts">
const props = defineProps<{ count?: number }>();
</script>
<template>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold">
			<slot />
			<span v-if="props.count" class="text-sm font-normal text-muted">
				{{ props.count }}
			</span>
		</h2>
	</div>
</template>
