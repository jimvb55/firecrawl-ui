# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY backend/package*.json ./
RUN npm install

COPY backend/ .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/index.js"]
