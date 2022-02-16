Pushing Duplo Trains
====================


Usage
-----

```bash
npm install
npm start
```

Docker image
------------

### Build and push

```bash
docker build -t vi7al/train-pusher -t vi7al/train-pusher:$(jq -r .version package.json) .
docker push vi7al/train-pusher
docker push vi7al/train-pusher:$(jq -r .version package.json)
```
