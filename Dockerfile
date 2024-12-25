FROM node:20-alpine as base
FROM base as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM base
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/mailer/templates ./dist/mailer/templates

EXPOSE 3000

CMD ["yarn", "start:prod"]
