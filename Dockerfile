FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/* \
    # NOTE: yarn > 1.22.19 breaks yarn-install invoked by pnpm
    && npm install -g pnpm@8.15.9 yarn@1.22.19 --force \
    && git config --global --add safe.directory /code

WORKDIR /code

# -------------------------- Nginx - Builder --------------------------------
FROM dev AS web-app-serve-build

COPY package.json pnpm-lock.yaml /code/

RUN pnpm install

COPY . /code/

# # Build variables (Requires backend pulled)
ENV APP_TITLE=CMS
ENV APP_GRAPHQL_ENDPOINT=http://localhost:8001/graphql/
ENV APP_GRAPHQL_CODEGEN_ENDPOINT=./backend/schema.graphql

RUN pnpm generate:type && WEB_APP_SERVE_ENABLED=true pnpm build
# RUN pnpm build

# ---------------------------------------------------------------------
FROM ghcr.io/toggle-corp/web-app-serve:v0.1.2 AS web-app-serve

LABEL org.opencontainers.image.source="https://github.com/my-org/my-best-dashboard"
LABEL org.opencontainers.image.authors="my-email@company.com"

# Env for apply-config script
ENV APPLY_CONFIG__SOURCE_DIRECTORY=/code/build/

COPY --from=web-app-serve-build /code/build "$APPLY_CONFIG__SOURCE_DIRECTORY"
