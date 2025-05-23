module.exports = {
    printWidth: 90,
    useTabs: true,
    tabWidth: 4,
    overrides: [
        {
            files: ["*.tsx", "*.jsx", "*.html", ".vue"],
            options: {
                useTabs: false,
                tabWidth: 2
            }
        }
    ]
}
