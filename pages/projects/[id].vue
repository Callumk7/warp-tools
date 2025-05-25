<script setup lang="ts">
const route = useRoute();
const projectId = route.params.id;

definePageMeta({
	title: "Edit Project",
});
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
			<UButton to="/projects" variant="ghost">Back to Projects</UButton>
		</div>
		
		<UCard>
			<div class="text-center py-8">
				<p class="text-gray-500">Project edit page for ID: {{ projectId }}</p>
				<p class="text-sm text-gray-400 mt-2">This page is under construction.</p>
			</div>
		</UCard>
	</div>
</template>