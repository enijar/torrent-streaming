> Deprecated. Use the new version here [torrents](https://github.com/enijar/torrents)

# 🍿 Torrent Streaming

Watch video torrents online. Streams them directly to your browser.

![Preview](.github/misc/preview.jpg)

### Getting Started

```shell
cp .env.example .env

npm install
npm start
```

### CLI Scripts

```shell
# Add and update streams in database from YTS API
npm --prefix server run update-movies
```

### Production

```shell
cp .env.example .env

npm install
npm run build

npm add -g pm2
pm2 startup

pm2 start --name server /var/www/torrent-streaming/server/build/index.js
pm2 save
```
