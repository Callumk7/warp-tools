<template>
	<UCard>
		<div class="flex flex-col gap-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold">{{ invoice?.invoiceNumber }}</h1>
					<p class="text-gray-600">Invoice Details</p>
				</div>
				<UBadge 
					:color="getStatusColor(invoice?.status)" 
					size="lg" 
					variant="soft"
				>
					{{ invoice?.status }}
				</UBadge>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<UCard>
					<template #header>
						<h3 class="text-lg font-semibold">Invoice Information</h3>
					</template>
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-600">Invoice Number:</span>
							<span class="font-medium">{{ invoice?.invoiceNumber }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Issue Date:</span>
							<span class="font-medium">{{ formatDate(invoice?.issueDate) }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Due Date:</span>
							<span class="font-medium">{{ formatDate(invoice?.dueDate) }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Project:</span>
							<span class="font-medium">{{ invoice?.project?.name || 'No Project' }}</span>
						</div>
					</div>
				</UCard>

				<UCard>
					<template #header>
						<h3 class="text-lg font-semibold">Payment Summary</h3>
					</template>
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-600">Subtotal:</span>
							<span class="font-medium">£{{ invoice?.subtotal?.toFixed(2) }}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Tax Rate:</span>
							<span class="font-medium">{{ invoice?.taxRate }}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Tax Amount:</span>
							<span class="font-medium">£{{ invoice?.taxAmount?.toFixed(2) }}</span>
						</div>
						<UDivider />
						<div class="flex justify-between text-lg font-bold">
							<span>Total:</span>
							<span>£{{ invoice?.total?.toFixed(2) }}</span>
						</div>
					</div>
				</UCard>
			</div>

			<UCard v-if="invoiceItems?.length">
				<template #header>
					<h3 class="text-lg font-semibold">Invoice Items</h3>
				</template>
				<UTable :data="invoiceItems" :columns="itemColumns" />
			</UCard>

			<UCard v-if="payments?.length">
				<template #header>
					<h3 class="text-lg font-semibold">Payment History</h3>
				</template>
				<UTable :data="payments" :columns="paymentColumns" />
			</UCard>

			<div v-if="invoice?.notes" class="mt-6">
				<UCard>
					<template #header>
						<h3 class="text-lg font-semibold">Notes</h3>
					</template>
					<p class="text-gray-700">{{ invoice.notes }}</p>
				</UCard>
			</div>

			<div class="flex gap-3 mt-6">
				<UButton to="/invoices" variant="outline" icon="i-lucide-arrow-left">
					Back to Invoices
				</UButton>
				<UButton 
					color="primary" 
					icon="i-lucide-edit"
					:to="`/invoices/${invoice?.id}/edit`"
				>
					Edit Invoice
				</UButton>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { Invoice, InvoiceInsert } from '~/db/schema'
import type { TableColumn } from '@nuxt/ui'

type InvoiceWithProject = Invoice & {
	project?: {
		id: string
		name: string
		client?: {
			id: string
			name: string
		}
	}
}

type InvoiceItem = {
	id: string
	invoiceId: string
	description: string
	quantity: number
	unitPrice: number
	amount: number
	taxable: boolean
}

type Payment = {
	id: string
	invoiceId: string
	amount: number
	paymentDate: string | Date
	paymentMethod?: string
	reference?: string
	notes?: string
	createdAt: string | Date
}

const route = useRoute()
const invoiceId = route.params.id as string

const { data: invoice } = await useFetch<InvoiceWithProject>(`/api/invoices/${invoiceId}`)
const { data: invoiceItems } = await useFetch<InvoiceItem[]>(`/api/invoices/${invoiceId}/items`)
const { data: payments } = await useFetch<Payment[]>(`/api/invoices/${invoiceId}/payments`)

const itemColumns: TableColumn<InvoiceItem>[] = [
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ cell }) => cell.getValue()
	},
	{
		accessorKey: 'quantity',
		header: 'Quantity',
		cell: ({ cell }) => cell.getValue()
	},
	{
		accessorKey: 'unitPrice',
		header: 'Unit Price',
		cell: ({ cell }) => `£${(cell.getValue() as number)?.toFixed(2)}`
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ cell }) => `£${(cell.getValue() as number)?.toFixed(2)}`
	}
]

const paymentColumns: TableColumn<Payment>[] = [
	{
		accessorKey: 'paymentDate',
		header: 'Date',
		cell: ({ cell }) => formatDate(cell.getValue() as string | Date)
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ cell }) => `£${(cell.getValue() as number)?.toFixed(2)}`
	},
	{
		accessorKey: 'paymentMethod',
		header: 'Method',
		cell: ({ cell }) => cell.getValue() || 'N/A'
	},
	{
		accessorKey: 'reference',
		header: 'Reference',
		cell: ({ cell }) => cell.getValue() || 'N/A'
	}
]

function formatDate(date: string | Date | null | undefined) {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString('en-GB')
}

function getStatusColor(status: string | undefined) {
	switch (status) {
		case 'PAID': return 'success'
		case 'SENT': return 'primary'
		case 'DRAFT': return 'neutral'
		case 'OVERDUE': return 'error'
		case 'PARTIALLY_PAID': return 'warning'
		case 'CANCELLED': return 'error'
		default: return 'neutral'
	}
}
</script>