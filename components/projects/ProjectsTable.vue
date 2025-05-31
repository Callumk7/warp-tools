<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Project } from "~/db/schema";

interface Props {
	projects: Project[];
}

const props = defineProps<Props>();

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

const viewProject = (project: Project) => {
	navigateTo(`/projects/${project.id}`);
};

const editProject = (project: Project) => {
	navigateTo(`/projects/${project.id}`);
};

const projectColumns: TableColumn<Project>[] = [
	{
		accessorKey: "name",
		header: "Project Name",
		cell: ({ row }) =>
			h("div", [
				h("div", { class: "font-semibold" }, row.original.name),
				row.original.description
					? h(
							"div",
							{ class: "text-sm truncate max-w-xs" },
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
</script>

<template>
	<UTable :columns="projectColumns" :data="props.projects" class="w-full" />
</template>
