FROM node:18.2.0

RUN mkdir -p /usr/src/app
COPY ./src /usr/src/app/src
COPY ./package.json /usr/src/app/package.json
COPY ./tsconfig.json /usr/src/app/tsconfig.json
COPY ./nest-cli.json /usr/src/app/nest-cli.json
COPY ./yarn.lock /usr/src/app/yarn.lock
WORKDIR /usr/src/app/
RUN yarn
RUN yarn build
RUN rm -rf ./src

# Setting up ENVs
ENV NODE_ENV=development\
    PORT=3001\
    LOGGER_LEVEL=debug\
    LOGTAIL_TOKEN=J8p4WmRK37xKvH6DYLzsfckc\
    DATABASE_HOST=127.0.0.1\
    DATABASE_NAME=auth\
    DATABASE_USER=root\
    DATABASE_PASSWORD=root\
    REDIS_HOST=localhost\
    REDIS_PASSWORD=root\
    REDIS_PORT=6379\
    RABBITMQ_HOSTNAME=localhost\
    RABBITMQ_PORT=5672\
    RABBITMQ_USERNAME=root\
    RABBITMQ_PASSWORD=root\
    RABBITMQ_PRODUCTS_QUEUE_NAME=products_queue\
    ADD_PRODUCTS_TO_STOCK_SYMBOL=ADD_TO_STOCK\
    JWT_EXP_TIME=4h\
    JWT_SHARED_SECRET='dinamoretail'

# Seeting up start command
CMD ["yarn", "start", "dev"]