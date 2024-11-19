import {
    defineConfig,
    Schema,
} from '@julr/vite-plugin-validate-env';

export default defineConfig({
    // NOTE: We need to replace with URL
    APP_GRAPHQL_ENDPOINT: Schema.string.optional(),

    // NOTE: It is not used for now
    APP_TITLE: Schema.string.optional(),
});
