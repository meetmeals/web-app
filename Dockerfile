ARG VERSION

FROM salarhafezi/meetmeals-web-app-base:$VERSION AS build

WORKDIR /app

COPY . .

RUN yarn build

FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
