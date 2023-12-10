

## What is this?
It's a simple food application on top of Nestjs & MongoDB. It can be used for learning purposes & will be extended bit by bit.

## What are the features so far?
* Possible to register as a customer & restaurant user.
* Get verification link & verified by mail.
* JWT token and role-based authentications are available.
* Restaurant users can perform CRUD operations on the items.
* Restaurant user is also allowed to give discount on the item & total amount of order as well.
* Customer can perform CRUD operation on carts & also request for the orders.
* Customers are allowed to give ratings for restaurants.
* Users can search restaurants.

## ERD
![Food App ERD](https://github.com/TusharRoy23/food-app-nestjs/blob/master/food-app-ERD.png)

## What has been used by far?
| Name        | version |
| ------------|---------|
| NestJS      | 10.2.10 |
| MongoDB     | 6.0.3   |
| Mongo-express | latest|
| Elasticsearch | 10.0.1|
| Kibana      | 10.0.1  |
| @nestjs/swagger|7.1.16|


## Run the app using docker

```bash
# development (To start all the services)
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env build --no-cache
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env up

# development (To start any service)
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env build --no-cache anyServiceName
$ docker-compose -f docker-compose.dev.yml --env-file env/.dev.env up anyServiceName

# production mode
```
## Mongo Export
```bash
# Export results in a file
$ docker exec mongoContainerName mongoexport --uri="mongodb://UN:PWD@mongoContainerName:27017/DBName" --collection=CollectionName --type=json --fields=field1,field2 --out=collectionName.json --jsonArray 

# Copy the file from DB Container
$ docker cp DBcontainerName:/collectionName.json destinationFolderPath
```
## Mongo Shell
```bash
# Get inside the DB container
$ docker exec -it dbContainerName bash
# Use mongosh shell
$ mongosh -u username -p password dbName
```
More on - [Mongosh shell doc](https://www.mongodb.com/docs/mongodb-shell/crud/)
## Setup ELK
This command will only work during the initial configuration of the Elasticsearch security features.For More Info - [Elasticsearch Doc](https://www.elastic.co/guide/en/elasticsearch/reference/current/reset-password.html). On the other hand, by using kibana password can be changed for the user. Go to **Management** > **Stack Management** > **Security** > **Users**
```bash
# Set password for ELK
$ docker exec -it ESContainerName bin/elasticsearch-reset-password -u elastic -i
$ docker exec -it ESContainerName bin/elasticsearch-reset-password -u kibana_system -i
```
## Insert Mapping for restaurant in ES by using Kibana Dev tools
```bash
PUT restaurants 
{
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "name": {
        "type": "text"
      },
      "address": {
        "type": "text"
      },
      "opening_time": {
        "type": "date",
        "format": "HH:mm:ss"
      },
      "closing_time": {
        "type": "date",
        "format": "HH:mm:ss"
      },
      "current_status": {
        "type": "text"
      }
    }
  }
}
```
## Add restaurants info to Elasticsearch (Executed in root path)
```bash
# Prepare restaurants data according to ES Mapping
$ docker exec food-dev npx ts-node streamData.js

# Insert data to ES
$ docker exec food-dev node_modules/elasticdump/bin/elasticdump --input=restaurant.json --output=http://esUN:esPW@esFood01:9200/ --type=data
```
## Different URLs
- Swagger - [http://localhost:4000/api/v1/](http://localhost:4000/api/v1/)
- Mongo-express - [http://localhost:8082/admin/](http://localhost:8082/admin/)
- Kibana - [http://localhost:5601/esboard](http://localhost:5601/esboard)
## Test
```bash
# unit tests
$ npm run test yourFolderPath/fileName.spec.ts

# e2e tests
$ npm run test:e2e test/fileName.e2e-spec.ts

# test coverage
```
## CI/CD integration
- Checkout Medium - [CD with Google Cloud Run, GitHub Actions, Artifact Registry, & WIF](https://tushar-chy.medium.com/cd-with-google-cloud-run-github-actions-artifact-registry-workload-identity-federation-fcc8e317b327)
## Stay in touch
- Checkout my stories - [Medium](https://medium.com/@tushar-chy)
- Connect with me - [LinkedIn](https://www.linkedin.com/in/tushar-roy-chy/)
- Contact Me - chowdhurytusharroy@gmail.com
