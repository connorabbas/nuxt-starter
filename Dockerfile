# Intended for local/development use
FROM node:22-bookworm-slim AS dev
USER root
RUN apt-get update && apt-get install -y \
    git \
    openssh-client \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g opencode-ai

USER node

COPY --chown=node:node .devcontainer/.bashrc /home/node/.bashrc
RUN git config --global --add safe.directory /workspace
WORKDIR /workspace

EXPOSE 3000

CMD ["bash"]



# Build base
FROM node:22-alpine AS build-base
WORKDIR /app
COPY package*.json ./
RUN npm ci



# Production build (intermediate)
FROM build-base AS build-production
COPY . ./
RUN npm run build --if-present



# Production target
FROM dhi.io/node:22-alpine AS production
WORKDIR /app
COPY --from=build-production --chown=nonroot:nonroot /app/.output/ ./

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

USER nonroot

EXPOSE 3000

CMD ["/app/server/index.mjs"]
