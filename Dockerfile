# syntax=docker/dockerfile:1.7
# matteodante.it on Railway: Next.js "standalone" output, built with Bun.
FROM node:22-bookworm-slim AS build
ENV NEXT_TELEMETRY_DISABLED=1 CI=true
RUN npm install -g bun@1.3.5
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
# Public settings are built into the browser's code; Railway passes the
# service's variables to the build as arguments of the same name.
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_POSTHOG_KEY
RUN bun run build
# A small self-contained folder for the migrations Railway runs before each
# deploy (`bun --cwd /migrate migrate.ts`).
RUN mkdir /migrate && cp -r drizzle scripts/migrate.ts /migrate/ \
  && cd /migrate \
  && echo '{"private":true,"type":"module"}' > package.json \
  && bun add drizzle-orm@0.45.4 pg@8.23.1

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN npm install -g bun@1.3.5
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /migrate /migrate
USER node
EXPOSE 3000
CMD ["node", "server.js"]
