# Pilas

Pilas is a project from the technology company Act Tecnologia, where its employees have access to several kinds of food in exchange for a fictitious coin called Pila.

This system was devoloped to help Pilas, as it is a tool to manage those foods consumption.

This web application was developed as a final project for Internet Systems Graduation at UTFPR Campus Guarapuava.

To run this application, follow the steps bellow.

## Getting Started

### Setup dependencies for dev

- Nodejs: it's recommended to install via NVM ([https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm))

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

nvm install --lts
```

- Postgres database: feel free to use any method to setup your database, this project has a pre-configured file `docker-compose.yml` if you use docker compose:

```bash
docker compose up
```

Tip: database connection string can be found in `docker-compose.yml`, just add it to your `.env`.

### Setup .env

Create a copy of `.env.example` as `.env` and change the required environment variables.

### Run in development mode

To run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

(feel free to add more)

### Prisma

Migrate in development mode: this will apply all migrations if needed and create a new one if changes were made to the schema.

```bash
npx prisma migrate dev
```

Migrate in production mode: this will not create new migrations, just apply the old ones.

```bash
npx prisma migrate deploy
```

Prisma studio: this opens a graphical UI for database management (you can also use adminer if running db with docker compose)

```bash
npx prisma studio
```
