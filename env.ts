import {
    defineConfig,
    Schema,
} from '@julr/vite-plugin-validate-env';

export default defineConfig({
    COMPOSE_FILE: Schema.string.optional(),
    APP_TITLE: Schema.string.optional(),
});
