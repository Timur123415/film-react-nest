FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Устанавливаем все зависимости (включая dev для сборки)
RUN npm install

COPY . .

# Собираем проект
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]