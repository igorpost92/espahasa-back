FROM node:16-alpine
WORKDIR /app
COPY . .

ARG APP_PORT
ARG DB_HOST
ARG DB_PORT

ENV APP_PORT=$APP_PORT
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT

#todo nest is not command
#RUN yarn install --production

RUN yarn install
RUN yarn build
CMD ["yarn", "start:prod"]
EXPOSE $APP_PORT
