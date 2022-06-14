FROM node:16.15-alpine3.14

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g serve

RUN npm install

COPY . ./

ARG NODE_ENV
ARG PORT
ARG API_URL

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV API_URL=$API_URL

# Save all ENV_VARS into .env file
RUN echo "" > .env
RUN for s in $(echo $ENV_VARS | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do echo $s >> .env; done

RUN npm run build

ENTRYPOINT serve -s -l tcp://0.0.0.0:$PORT build
