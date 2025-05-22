<template>
  <UApp>
    <div class="flex h-screen">
      <AppSidebar />
      <div class="flex-1 overflow-y-auto">
        <div class="w-11/12 mx-auto mt-10">
          <UTabs v-model="activeTab" color="neutral" variant="link" :items="items" class="w-fit" />
          <div class="mt-5 ml-4">
            <NuxtPage />
          </div>
        </div>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';

const route = useRoute();
const router = useRouter();

// Define tab items with both display label and route path
const items = ref<TabsItem[]>([
  {
    label: "Overview",
    icon: "i-lucide-home",
    to: "/overview"
  },
  {
    label: "Invoices",
    icon: "i-lucide-file-text",
    to: "/invoices"
  },
  {
    label: "Expenses",
    icon: "i-lucide-badge-pound-sterling",
    to: "/expenses"
  },
  {
    label: "Clients",
    icon: "i-lucide-users",
    to: "/clients"
  }
]);

// Create a map of paths to tab indices for easier lookup
const pathToTabIndex = computed(() => {
  const map: Record<string, number> = {};
  items.value.forEach((item, index) => {
    if (item.to) map[item.to] = index;
  });
  return map;
});

// Compute the active tab based on current route
const activeTab = computed({
  get() {
    // Find the tab index that matches the current route path
    return pathToTabIndex.value[route.path] ?? 0;
  },
  set(tabIndex: number) {
    // Navigate to the path stored in the selected tab
    const selectedTab = items.value[tabIndex];
    if (selectedTab && selectedTab.to) {
      router.push(selectedTab.to);
    }
  }
});
</script>
