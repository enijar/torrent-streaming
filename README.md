# Torrent Streaming

Watch video torrents online. Streams them directly to your browser.

![Preview](.github/misc/preview.jpg)

### Getting Started

```shell
cp client/.env.example client/.env
cp server/.env.example server/.env

npm install
npm start
```

### CLI Scripts

```shell
# Add an email to the list of authorised emails
npm --prefix server run add-authorised-email username@domain.tld

# Add and update streams in database from YTS API
npm --prefix server run update-movies
```

### Production

```shell
##################################
# Build and run client container #
##################################
DOCKER_BUILDKIT=1 docker build client \
  --rm \
  -f client/Dockerfile \
  -t torrent-streaming/client \
  --build-arg NODE_ENV=production \
  --build-arg PORT=8080 \
  --build-arg API_URL=http://localhost:3000

docker run --rm -p 8080:8080 torrent-streaming/client

##################################
# Build and run server container #
##################################
DOCKER_BUILDKIT=1 docker build server \
  --rm \
  -f server/Dockerfile \
  -t torrent-streaming/server \
  --build-arg NODE_ENV=production \
  --build-arg PORT=3000 \
  --build-arg API_URL=http://localhost:3000 \
  --build-arg APP_URL=http://localhost:8080 \
  --build-arg CORS_ORIGINS=http://localhost:3000,http://localhost:8080 \
  --build-arg BCRYPT_ROUNDS=12 \
  --build-arg DATABASE_HOST=127.0.0.1 \
  --build-arg DATABASE_NAME=torrent-streaming \
  --build-arg DATABASE_DIALECT=sqlite \
  --build-arg DATABASE_USERNAME=torrent-streaming \
  --build-arg DATABASE_PASSWORD=secret \
  --build-arg DATABASE_STORAGE=.cache/database.sqlite \
  --build-arg JWT_SECRET=secret \
  --build-arg EMAIL_PREVIEW=true \
  --build-arg EMAIL_SEND=false \
  --build-arg EMAIL_FROM=hello@example.com \
  --build-arg EMAIL_SMTP_HOST=smtp.sendgrid.net \
  --build-arg EMAIL_SMTP_PORT=587 \
  --build-arg EMAIL_SMTP_USERNAME=apikey \
  --build-arg EMAIL_SMTP_PASSWORD=secret

docker run --rm -p 3000:3000 torrent-streaming/server
```
