<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";

interface Props {
	class?: string;
	modelValue?: CalendarDate;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	"update:modelValue": [value: CalendarDate];
}>();

const df = new DateFormatter("en-US", {
	dateStyle: "medium",
});

// Create a computed property for two-way binding
const selectedDate = computed({
	get: () => props.modelValue ?? new CalendarDate(2022, 1, 10),
	set: (value) => emit("update:modelValue", value),
});
</script>

<template>
	<UPopover>
		<UButton
			color="neutral"
			variant="outline"
			icon="i-lucide-calendar"
			:class="props.class"
		>
			{{
				selectedDate
					? df.format(selectedDate.toDate(getLocalTimeZone()))
					: "Select a date"
			}}
		</UButton>

		<template #content>
			<UCalendar v-model="selectedDate" class="p-2" />
		</template>
	</UPopover>
</template>
