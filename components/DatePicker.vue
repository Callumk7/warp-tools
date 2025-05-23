<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";

interface Props {
	className?: string;
}

const props = defineProps<Props>();

const df = new DateFormatter("en-US", {
	dateStyle: "medium",
});

const modelValue = shallowRef(new CalendarDate(2022, 1, 10));
</script>

<template>
	<UPopover>
		<UButton
			color="neutral"
			variant="outline"
			icon="i-lucide-calendar"
			:class="props.className"
		>
			{{
				modelValue
					? df.format(modelValue.toDate(getLocalTimeZone()))
					: "Select a date"
			}}
		</UButton>

		<template #content>
			<UCalendar v-model="modelValue" class="p-2" />
		</template>
	</UPopover>
</template>
