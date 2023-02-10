## 📖 README contents

### 🔗 Find the hosted version here: [nc.news on Render](https://news-7d6f.onrender.com).

### 📋 Summary of the project.

### 🛠 How to clone repo, install dependencies, seed local databases and run tests.

### 🗃 Creating the two `.env` files.

### ⚙️ Minimum versions of node and postgres.

---

### 📋 Summary of the project.

This project is my first server. It handles API requests to a database with a structure similar to a social media site. The client can request a range of data from the database as well as creating, updating and deleting some elements.

---

### 🛠 How to clone repo, install dependencies, seed local databases and run tests.

There are a few things you'll need to do to get the repo up and running for yourself.

### 1. Clone the repo.

Clone the repo by pasting

```
git clone https://github.com/bergamotBen/be-nc-news.git
```

into the terminal. Once you've cloned the repo, head to the 'Creating the environment variables' section to created local versions of gitignored files.

### 2. Install dependencies.

This repo was created using:

- dotenv
- express
- pg

The developer dependencies used are:

- jest
- jest-extended
- jest-sorted
- pg-format
- supertest

Install them with

```
npm install
```

### 3. Seed local databases

To seed local databases run the script:

```
npm run setup-dbs
```

### 4. Run tests

To run tests on the app run the script:

```
npm test app
```

---

### 🗃 Creating the environment variables.

Create two .env files to connect to each of the databases:

one for the test environment called `.env.test` containing

```
PGDATABASE=nc_news_test
```

and another for the development environment called `.env.development` containing

```
PGDATABASE=nc_news
```

The .env-example and db/setup.sql files show the format and database names.

---

### ⚙️ Minimum versions of node and postgres.

The minimum version of Node is v19.1.0
The minimum version of Postgres is v2.5.12 (171)
