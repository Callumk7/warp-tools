// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	rules: {
		"no-unused-vars": "off",
		"vue/html-self-closing": "off",
	},
});
