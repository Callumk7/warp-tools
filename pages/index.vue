<template>
	<div class="space-y-8">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold tracking-tight">Overview</h1>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Invoice Status Chart -->
			<UCard>
				<template #header>
					<h2 class="text-xl font-semibold">Invoices by Status</h2>
				</template>
				<div class="h-80">
					<Doughnut
						v-if="invoiceStatusData.labels.length > 0"
						:data="invoiceStatusData"
						:options="chartOptions"
					/>
					<div
						v-else
						class="flex items-center justify-center h-full text-muted"
					>
						No invoice data available
					</div>
				</div>
			</UCard>

			<!-- Top Clients Chart -->
			<UCard>
				<template #header>
					<h2 class="text-xl font-semibold">Top Clients by Invoice Total</h2>
				</template>
				<div class="h-80">
					<Bar
						v-if="topClientsData.labels.length > 0"
						:data="topClientsData"
						:options="barChartOptions"
					/>
					<div
						v-else
						class="flex items-center justify-center h-full text-muted"
					>
						No client data available
					</div>
				</div>
			</UCard>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<UCard>
				<div class="text-center">
					<div class="text-3xl font-bold text-green-600">
						{{ stats.totalInvoices }}
					</div>
					<div class="text-sm text-muted">Total Invoices</div>
				</div>
			</UCard>
			<UCard>
				<div class="text-center">
					<div class="text-3xl font-bold text-blue-600">
						{{ formatCurrency(stats.totalRevenue) }}
					</div>
					<div class="text-sm text-muted">Total Revenue</div>
				</div>
			</UCard>
			<UCard>
				<div class="text-center">
					<div class="text-3xl font-bold text-orange-600">
						{{ formatCurrency(stats.pendingAmount) }}
					</div>
					<div class="text-sm text-muted">Pending Amount</div>
				</div>
			</UCard>
			<UCard>
				<div class="text-center">
					<div class="text-3xl font-bold text-purple-600">
						{{ stats.activeClients }}
					</div>
					<div class="text-sm text-muted">Active Clients</div>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Doughnut, Bar } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	type ChartOptions,
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
);

const { data: overviewData } = await useFetch("/api/overview");

const stats = computed(
	() =>
		overviewData.value?.stats || {
			totalInvoices: 0,
			totalRevenue: 0,
			pendingAmount: 0,
			activeClients: 0,
		},
);

const invoiceStatusData = computed(() => ({
	labels: overviewData.value?.invoicesByStatus.map((item) => item.status) || [],
	datasets: [
		{
			data: overviewData.value?.invoicesByStatus.map((item) => item.count) || [],
			backgroundColor: [
				"#3B82F6", // blue - draft
				"#F59E0B", // amber - sent
				"#10B981", // emerald - paid
				"#8B5CF6", // violet - partially paid
				"#EF4444", // red - overdue
				"#6B7280", // gray - cancelled
			],
			borderWidth: 0,
		},
	],
}));

const topClientsData = computed(() => ({
	labels: overviewData.value?.topClients.map((item) => item.clientName) || [],
	datasets: [
		{
			label: "Total Invoiced",
			data: overviewData.value?.topClients.map((item) => item.totalAmount) || [],
			backgroundColor: "#3B82F6",
			borderColor: "#2563EB",
			borderWidth: 1,
		},
	],
}));

const chartOptions: ChartOptions<"doughnut"> = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "bottom",
		},
	},
};

const barChartOptions: ChartOptions<"bar"> = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		y: {
			beginAtZero: true,
			ticks: {
				callback: function (value) {
					return formatCurrency(value as number);
				},
			},
		},
	},
};

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP",
	}).format(amount);
}
</script>
