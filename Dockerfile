# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY .babelrc jsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/build ./build
COPY public ./public
COPY src/views ./build/views

RUN mkdir -p private/logs private/cache private/backups public/uploads

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8082

EXPOSE 8082

CMD ["node", "build/main.js"]
