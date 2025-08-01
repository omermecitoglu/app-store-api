# Build Stage
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
# COPY .npmrc ./
# add private registry tokens here. e.g. github, fontawesome
RUN npm install
COPY . .
# add necessary env variables for build
ENV STANDALONE_OUTPUT_MODE=yes
RUN npm run build

# Runtime Stage
FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app/.next/standalone .
COPY --from=build /app/.next/static .next/static
# COPY --from=build /app/public public
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["node", "server"]
