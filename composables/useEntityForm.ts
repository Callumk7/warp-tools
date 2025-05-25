/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive, ref } from "vue";
import type { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { FormSubmitEvent } from "@nuxt/ui";

export interface EntityFormOptions<T extends z.ZodObject<any>> {
	schema: T;
	initialState?: z.infer<T>;
	endpoint: string;
	successMessage?: string;
	redirectPath?: string;
	transformData?: (data: z.infer<T>) => any;
}

type UFormSubmitHandler<T> = ((payload: FormSubmitEvent<T>) => any) | (() => any);

export function useEntityForm<T extends z.ZodObject<any>>({
	schema,
	initialState = {},
	endpoint,
	successMessage = "Entity created successfully",
	redirectPath,
	transformData,
}: EntityFormOptions<T>) {
	// Create state with initial values
	const state = reactive<z.infer<T>>({
		...initialState,
	});

	const isSubmitting = ref(false);
	const router = useRouter();
	const toast = useToast();

	const user = requireAuth();

	const onSubmit: UFormSubmitHandler<z.infer<T>> = async (event) => {
		isSubmitting.value = true;

		try {
			// Prepare entity data with common fields
			let entityData = {
				id: uuidv4(),
				...event.data,
				userId: user.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Apply custom transformation if provided
			if (transformData) {
				entityData = transformData(entityData);
			}

			// Send data to API
			const { data, error } = await useFetch(endpoint, {
				method: "POST",
				body: entityData,
			});

			if (error.value) {
				throw new Error(error.value.message || `Failed to create entity`);
			}

			// Show success message
			toast.add({
				title: "Success",
				description: successMessage,
				color: "success",
			});

			// Navigate if path provided
			if (redirectPath) {
				router.push(redirectPath);
			}

			return { data: data.value, success: true };
		} catch (error) {
			console.error("Error creating entity:", error);

			// Show error message
			toast.add({
				title: "Error",
				description:
					error.message || "Failed to create entity. Please try again.",
				color: "error",
			});

			return { error, success: false };
		} finally {
			isSubmitting.value = false;
		}
	};

	return {
		schema,
		state,
		isSubmitting,
		onSubmit,
	};
}
