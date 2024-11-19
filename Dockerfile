FROM node:18-bullseye

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
RUN npm install -g pnpm

WORKDIR /code

RUN git config --global --add safe.directory /code
