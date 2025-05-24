# Agent Guidelines for Warp Tools

## Commands
- **Dev**: `pnpm dev` - Start development server
- **Build**: `pnpm build` - Build for production
- **Type Check**: No explicit command (run `pnpm build` to check)
- **Lint**: ESLint runs with Nuxt module automatically
- **Database**: `pnpm db:migrate`, `pnpm db:studio`, `pnpm db:seed`

## Code Style
- **Package Manager**: Use `pnpm` exclusively
- **Formatting**: Prettier with tabs (4 spaces), 2 spaces for .vue/.tsx/.jsx files, 90 char line width
- **TypeScript**: Use strict typing, interfaces for props, computed properties for reactivity
- **Imports**: Use tilde `~/` for project root imports (e.g., `~/lib/auth-client`)
- **Components**: Vue 3 Composition API with `<script setup lang="ts">`, defineProps/defineEmits pattern
- **API Routes**: Use `defineEventHandler` in server/api directory
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **v-model**: Use `modelValue` prop with `update:modelValue` emit for custom components
- **UI**: Nuxt UI components (UButton, UCalendar, UPopover, etc.)
- **Database**: Drizzle ORM with PostgreSQL, auth via better-auth
- **No unused vars**: ESLint disabled for unused variables, self-closing tags not enforced