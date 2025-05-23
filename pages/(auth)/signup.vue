<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import { signUp } from "~/lib/auth-client";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  name: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // handle the sign up
  await signUp.email({
    email: state.email!,
    password: state.password!,
    name: state.name!,
    fetchOptions: {
      onSuccess() {
        useRouter().push("/")
      }
    }
  })

  toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
  console.log(event.data);
}
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="p-4 border rounded-md">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormField>

        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton type="submit">
          submit
        </UButton>
      </UForm>
    </div>
  </div>
</template>
