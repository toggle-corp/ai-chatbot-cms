import {
    defineConfig,
    Schema,
} from '@julr/vite-plugin-validate-env';

export default defineConfig({
    APP_TITLE: Schema.string.optional(),
    GRAPHQL_ENDPOINT: Schema.string.optional(),
});
