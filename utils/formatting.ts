import type { Project } from "~/db/schema";

export const formatRate = (project: Project) => {
	if (!project.rateAmount) return "Not set";
	const amount = new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: project.currency,
	}).format(project.rateAmount);
	return `${amount} ${project.rateType === "HOURLY" ? "/hr" : "fixed"}`;
};

export const formatDate = (date: string | Date) => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case "COMPLETED":
			return "success";
		case "IN_PROGRESS":
			return "secondary";
		case "ON_HOLD":
			return "warning";
		case "CANCELLED":
			return "error";
		default:
			return "neutral";
	}
};

const statusOptions = [
	{ label: "In Progress", value: "IN_PROGRESS" },
	{ label: "Completed", value: "COMPLETED" },
	{ label: "On Hold", value: "ON_HOLD" },
	{ label: "Cancelled", value: "CANCELLED" },
];

export const getStatusLabel = (status: string) => {
	return statusOptions.find((option) => option.value === status)?.label || status;
};
