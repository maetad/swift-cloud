FROM node:20-alpine AS base

ENV WORKDIR /usr/src/app

RUN yarn set version 4.2.2

## Dependency
FROM base AS deps

WORKDIR ${WORKDIR}

COPY .yarnrc.yml package.json yarn.lock .
COPY .yarn .yarn
RUN yarn install --immutable

## Builder
FROM base AS builder

WORKDIR ${WORKDIR}

COPY --from=deps ${WORKDIR}/node_modules ./node_modules
COPY .yarnrc.yml package.json yarn.lock .
COPY .yarn .yarn
COPY .eslintrc.js nest-cli.json tsconfig.build.json tsconfig.json .
COPY src ./src

RUN yarn build

## Default
FROM base

RUN apk update && apk add bash

WORKDIR ${WORKDIR}

COPY --from=deps ${WORKDIR}/node_modules ./node_modules
COPY --from=builder ${WORKDIR}/dist ./dist
COPY .yarnrc.yml package.json yarn.lock tsconfig.json .
COPY .yarn .yarn

RUN chown -R 1001:0 $WORKDIR && chmod -R ug+rwx $WORKDIR
USER 1001

EXPOSE 3000
CMD ["yarn", "start:prod"]
