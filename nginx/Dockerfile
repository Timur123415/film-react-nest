FROM node:20-alpine AS builder
WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend/ .
RUN npm run build

FROM nginx:alpine
WORKDIR /app

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /app/public

CMD ["nginx", "-g", "daemon off;"]