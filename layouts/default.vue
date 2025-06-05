<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();

// Define tab items with both display label and route path
const items = ref<TabsItem[]>([
	{
		label: "Overview",
		icon: "i-lucide-home",
		to: "/overview",
		value: "overview",
	},
	{
		label: "Invoices",
		icon: "i-lucide-file-text",
		to: "/invoices",
		value: "invoices",
	},
	{
		label: "Expenses",
		icon: "i-lucide-badge-pound-sterling",
		to: "/expenses",
		value: "expenses",
	},
	{
		label: "Clients",
		icon: "i-lucide-users",
		to: "/clients",
		value: "clients",
	},
	{
		label: "Projects",
		icon: "i-lucide-layers",
		to: "/projects",
		value: "projects",
	},
]);

// Create a map of paths to tab values for easier lookup
const pathToTabValue = computed(() => {
	const map: Record<string, string> = {};
	items.value.forEach((item) => {
		if (item.to && item.value) map[item.to] = String(item.value);
	});
	return map;
});

// Compute the active tab based on current route
const activeTab = computed<string | number>({
	get() {
		// Find the tab value that matches the current route path
		return pathToTabValue.value[route.path] || "overview";
	},
	set(tabValue: string | number) {
		// Navigate to the path stored in the selected tab
		const selectedTab = items.value.find((item) => item.value === String(tabValue));
		if (selectedTab && selectedTab.to) {
			router.push(selectedTab.to);
		}
	},
});
</script>
<template>
	<div class="w-11/12 mx-auto mt-10">
		<div class="w-full flex justify-between">
			<UTabs
				v-model="activeTab"
				:content="false"
				variant="link"
				:items="items"
				class="w-fit"
			/>
			<div class="flex items-center gap-4">
				<ColorModeButton />
				<LogoutButton />
			</div>
		</div>
		<div class="mt-5 ml-4">
			<slot />
		</div>
	</div>
</template>
