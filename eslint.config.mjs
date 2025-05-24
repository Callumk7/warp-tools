// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		"no-unused-vars": "off",
		"vue/html-self-closing": "off",
	},
});
