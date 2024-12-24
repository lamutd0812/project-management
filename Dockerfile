# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY . .
RUN yarn
RUN yarn build

# Run stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock
COPY ./config /app/config

EXPOSE 3000
CMD ["yarn", "start:prod"]
