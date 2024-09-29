# Desafio Tecnico Teddy

## Technologies

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger
- Jest
- Docker

## Project setup

### Configure .env

```bash
# Make sure to adjust the environment variables in the .env file according to your configuration needs.
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=teddydb
API_PORT=3000
JWT_SECRET=mysecretsecret
```

### Run

```bash
$ npm install

### TO RUN LOCALLY
$ docker-compose up postgres
$ npm start

### OR

### TO RUN ON DOCKER
$ docker-compose up --build


$ npm run start
```

### Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Points for Improvement for Horizontal Scalability

Implementing microservices with load balancing and cache results.
