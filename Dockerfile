FROM node:20-bookworm-slim

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make

RUN npm install -g pnpm@8.15.9

WORKDIR /code

RUN git config --global --add safe.directory /code
