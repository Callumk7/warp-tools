<script setup lang="ts">
import { z } from "zod";
import { signIn } from "~/lib/auth-client";

const schema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	email: undefined,
	password: undefined,
});

const toast = useToast();

async function onSubmit() {
	await signIn.email({
		email: state.email!,
		password: state.password!,
		fetchOptions: {
			onSuccess() {
				useRouter().push("/");
			},
			onError() {
				toast.add({
					title: "Error",
					description: "Login failed, please try again.",
					color: "warning",
				});
			},
		},
	});
}
</script>

<template>
	<div class="h-screen flex justify-center items-center">
		<div class="p-4 border border-muted rounded-md">
			<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField label="Email" name="email">
					<UInput v-model="state.email" />
				</UFormField>

				<UFormField label="Password" name="password">
					<UInput v-model="state.password" type="password" />
				</UFormField>

				<UButton type="submit"> submit </UButton>
			</UForm>
		</div>
	</div>
</template>
