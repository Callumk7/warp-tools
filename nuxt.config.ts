// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	modules: ["@nuxt/ui", "@nuxt/icon", "@nuxt/eslint"],
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
});
