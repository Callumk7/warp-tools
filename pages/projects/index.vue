<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Project, Client, Invoice } from "~/db/schema";

definePageMeta({
	title: "Projects",
});

// Extended Project type with client relation for the API response
type ProjectWithClient = Project & {
	client: Client;
	invoices: Invoice[];
	total: number;
};

// Data
const { data: projects, refresh: refreshProjects } =
	await useFetch<ProjectWithClient[]>("/api/projects");

// Resolve components for table cells
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

// Table columns
const columns: TableColumn<ProjectWithClient>[] = [
	{
		accessorKey: "name",
		header: "Project Name",
		cell: ({ row }) =>
			h("div", [
				h("div", { class: "font-semibold" }, row.original.name),
				row.original.description
					? h(
							"div",
							{ class: "text-sm text-dimmed truncate max-w-xs" },
							row.original.description,
						)
					: null,
			]),
	},
	{
		accessorKey: "client",
		header: "Client",
		cell: ({ row }) => row.original.client.name,
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
		accessorKey: "total",
		header: "Total",
		cell: ({ row }) => h("div", row.original.total),
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => h("div", formatDate(row.original.createdAt)),
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) =>
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
	},
];

const formatRate = (project: Project) => {
	if (!project.rateAmount) return "Not set";
	const amount = new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: project.currency,
	}).format(project.rateAmount);
	return `${amount} ${project.rateType === "HOURLY" ? "/hr" : project.rateType === "DAILY" ? "/day" : "fixed"}`;
};

const formatDate = (date: string | Date) => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const onProjectCreated = async () => {
	await refreshProjects();
};

const editProject = (project: ProjectWithClient) => {
	// Navigate to edit page
	navigateTo(`/projects/${project.id}`);
};
</script>

<template>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Projects</h1>
			<CreateProjectModal />
		</div>

		<!-- Projects Table -->
		<UTable :columns="columns" :data="projects || []" class="w-full" />
	</div>
</template>
