# Используем образ node в качестве базового
FROM node:alpine AS build

# Устанавливаем рабочую директорию в /app
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Собираем React-приложение
RUN npm run build

# Используем образ nginx для запуска приложения веб-сервера
FROM nginx:alpine

# Копируем собранные файлы React-приложения из предыдущего этапа в рабочую директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# Экспортируем порт 80
EXPOSE 80

# Команда для запуска nginx внутри контейнера
CMD ["nginx", "-g", "daemon off;"]
