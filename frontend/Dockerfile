FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# custom nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]