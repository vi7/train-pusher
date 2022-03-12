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

### Releasing image

Bump app version:
```bash
npm version <X.Y.Z>
git push
git push --tags
```

Build and push the image:
```bash
docker build -t vi7al/train-pusher -t vi7al/train-pusher:$(jq -r .version package.json) .
docker push vi7al/train-pusher \
&& docker push vi7al/train-pusher:$(jq -r .version package.json)
```
