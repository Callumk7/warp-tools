<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Project, Client } from "~/db/schema";

definePageMeta({
	title: "Client Details",
});

// State
const route = useRoute();
const clientId = route.params.id as string;
const isModalOpen = ref(false);
const isLoading = ref(false);

// Data fetching
const { data: client, refresh: refreshClient } = await useFetch<
	Client & { projects: Project[] }
>(`/api/clients/${clientId}`);

// Fetch clients for the modal
const { data: clients } = await useFetch<Client[]>("/api/clients");

// Breadcrumb navigation
const breadcrumbItems = computed(() => [
	{
		label: "Home",
		icon: "i-lucide-house",
		to: "/",
	},
	{
		label: "Clients",
		icon: "i-lucide-users",
		to: "/clients",
	},
	{
		label: client.value?.name || "Client",
		icon: "i-lucide-user",
	},
]);

// Resolve components for table cells
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

// Table columns for projects
const projectColumns: TableColumn<Project>[] = [
	{
		accessorKey: "name",
		header: "Project Name",
		cell: ({ row }) =>
			h("div", [
				h(
					"div",
					{ class: "font-semibold text-gray-900 dark:text-white" },
					row.original.name,
				),
				row.original.description
					? h(
							"div",
							{ class: "text-sm text-gray-500 truncate max-w-xs" },
							row.original.description,
						)
					: null,
			]),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) =>
			h(
				UBadge,
				{ color: getStatusColor(row.original.status), variant: "soft" },
				{ default: () => getStatusLabel(row.original.status) },
			),
	},
	{
		accessorKey: "rate",
		header: "Rate",
		cell: ({ row }) => h("div", formatRate(row.original)),
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) =>
			h(
				"div",
				row.original.startDate ? formatDate(row.original.startDate) : "Not set",
			),
	},
	{
		accessorKey: "endDate",
		header: "End Date",
		cell: ({ row }) =>
			h("div", row.original.endDate ? formatDate(row.original.endDate) : "Not set"),
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) =>
			h("div", { class: "flex space-x-2" }, [
				h(
					UButton,
					{
						size: "sm",
						variant: "outline",
						icon: "i-lucide-eye",
						onClick: () => viewProject(row.original),
					},
					{ default: () => "View" },
				),
				h(
					UButton,
					{
						size: "sm",
						variant: "outline",
						icon: "i-lucide-edit",
						onClick: () => editProject(row.original),
					},
					{ default: () => "Edit" },
				),
			]),
	},
];

// Status color mapping
const getStatusColor = (status: string) => {
	switch (status) {
		case "COMPLETED":
			return "green";
		case "IN_PROGRESS":
			return "blue";
		case "ON_HOLD":
			return "yellow";
		case "CANCELLED":
			return "red";
		default:
			return "gray";
	}
};

const statusOptions = [
	{ label: "In Progress", value: "IN_PROGRESS" },
	{ label: "Completed", value: "COMPLETED" },
	{ label: "On Hold", value: "ON_HOLD" },
	{ label: "Cancelled", value: "CANCELLED" },
];

const getStatusLabel = (status: string) => {
	return statusOptions.find((option) => option.value === status)?.label || status;
};

const formatRate = (project: Project) => {
	if (!project.rateAmount) return "Not set";
	const amount = new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: project.currency,
	}).format(project.rateAmount);
	return `${amount} ${project.rateType === "HOURLY" ? "/hr" : "fixed"}`;
};

const formatDate = (date: string | Date) => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const openModal = () => {
	isModalOpen.value = true;
};

const onProjectCreated = async () => {
	await refreshClient();
};

const viewProject = (project: Project) => {
	navigateTo(`/projects/${project.id}`);
};

const editProject = (project: Project) => {
	navigateTo(`/projects/${project.id}`);
};

const editClient = () => {
	// Navigate to edit client page (for future functionality)
	navigateTo(`/clients/${clientId}/edit`);
};

// Handle error and not found states
if (!client.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Client not found",
	});
}
</script>

<template>
	<div v-if="!client" class="flex items-center justify-center min-h-96">
		<div class="text-center">
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
				Client not found
			</h2>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				The client you're looking for doesn't exist.
			</p>
			<UButton to="/clients" class="mt-4">Back to Clients</UButton>
		</div>
	</div>

	<div v-else class="space-y-6">
		<!-- Breadcrumb -->
		<UBreadcrumb :items="breadcrumbItems" />

		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				{{ client.name }}
			</h1>
			<div class="flex space-x-3">
				<UButton variant="outline" icon="i-lucide-edit" @click="editClient">
					Edit Client
				</UButton>
			</div>
		</div>

		<!-- Client Information Card -->
		<UCard>
			<template #header>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
					Client Information
				</h2>
			</template>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<div v-if="client.contactPerson">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Contact Person
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.contactPerson }}
					</p>
				</div>

				<div v-if="client.email">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Email
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.email }}
					</p>
				</div>

				<div v-if="client.phoneNumber">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Phone Number
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.phoneNumber }}
					</p>
				</div>

				<div v-if="client.address">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Address
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.address }}
					</p>
				</div>

				<div v-if="client.city">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						City
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.city }}
					</p>
				</div>

				<div v-if="client.postcode">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Postcode
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.postcode }}
					</p>
				</div>

				<div v-if="client.country">
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Country
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ client.country }}
					</p>
				</div>

				<div>
					<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
						Client Since
					</h3>
					<p class="mt-1 text-sm text-gray-900 dark:text-white">
						{{ formatDate(client.createdAt) }}
					</p>
				</div>
			</div>

			<div v-if="client.notes" class="mt-6">
				<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Notes
				</h3>
				<p class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
					{{ client.notes }}
				</p>
			</div>
		</UCard>

		<!-- Projects Section -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
					Projects
					<span
						class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2"
					>
						({{ client.projects?.length || 0 }})
					</span>
				</h2>
			</div>

			<!-- Projects Table or Empty State -->
			<UCard v-if="client.projects && client.projects.length > 0">
				<UTable
					:columns="projectColumns"
					:data="client.projects"
					:loading="isLoading"
					class="w-full"
				/>
			</UCard>

			<!-- Empty State -->
			<div
				v-else
				class="text-center py-12 bg-white dark:bg-gray-900 shadow rounded-lg"
			>
				<div class="flex flex-col items-center">
					<div
						class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4"
					>
						<UIcon
							name="i-lucide-folder-open"
							class="w-8 h-8 text-gray-400"
						/>
					</div>
					<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No projects yet
					</h3>
					<p class="text-gray-500 dark:text-gray-400 mb-6">
						Get started by creating a project for this client.
					</p>
					<UButton icon="i-lucide-plus" @click="openModal">
						Create First Project
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

