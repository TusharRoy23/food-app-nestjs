

## What is this?
It's a simple food application on top of nestjs & mongodb. It can be used for learning purpose & will be extended bit by bit.

## What has been used?
| Name        | version |
| ------------|---------|
| NestJS      | 9.2.1   |
| MongoDB     | 6.0.3   |
| Mongo-express | latest|
| Elasticsearch | 7.17.9|
| Kibana      | 7.17.9  |


## Running the app using docker

```bash
# development (To start all the service)
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env up
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env build --no-cache

# development (To start any service)
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env up anyServiceName
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env build --no-cache anyServiceName

# production mode
```
## Setup ELK
```bash
# Set password for ELK
$ docker exec -it elasticContainerName bin/elasticsearch-setup-passwords interactive
```

## Mongo Export
```bash
# Export results in a file
$ docker exec mongoContainerName mongoexport --uri="mongodb://UN:PWD@mongoContainerName:27017/DBName" --collection=CollectionName --type=json --fields=field1,field2 --out collectionName.json

# Copy the file from mongo Container
$ docker cp containerName:/collectionName.json destinationFolderPath
```

## Different URLs
- Swagger URL - [http://localhost:4000/api/v1/](http://localhost:4000/api/v1/)
- Mongo-express URL - [http://localhost:8082/](http://localhost:8082/)
- Kibana - [http://localhost:5601/](http://localhost:5601/)

## Test

```bash
# unit tests

# e2e tests

# test coverage
```

## Stay in touch

- Checkout my stories - [Medium](https://medium.com/@tushar-chy)
- Connect with me - [LinkedIn](https://www.linkedin.com/in/tushar-roy-chy/)
- Contact Me - chowdhurytusharroy@gmail.com
