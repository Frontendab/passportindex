FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

ARG VITE_API_URL
ARG VITE_CAPTCHA_SITE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CAPTCHA_SITE_KEY=$VITE_CAPTCHA_SITE_KEY

RUN npm run build

FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# custom nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]