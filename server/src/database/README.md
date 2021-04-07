# Setting up PostgreSQL

This provides instructions on how to set up the PostgreSQL database and populate it with the mock data.

## Setting up Postgres login role and database

1. Login to SQL shell (psql)
   Server: localhost
   Database: postgres
   Port: 5432
   Username: postgres
   Password: specified during install
2. Create new ROLE: `CREATE ROLE admin WITH LOGIN PASSWORD 'password';`
3. Alter role so it can create a database: `ALTER ROLE admin CREATEDB;`
4. Check admin has the correct attributes: `\du;`
5. Restart psql and login with admin. (`postgres=>` indicates we are not logged in as superuser)
6. Create database: `CREATE DATABASE listings;`

## Create the table to put our mock data into

1. Connect to the listings database: `\c listings;`
2. Copy and paste the command from `create-table.sql`:

    ```sql
    create table MOCK_DATA (
        id INT,
        name VARCHAR(50),
        email VARCHAR(50),
        message TEXT,
        created DATE,
        pin INT
    );
    ```

3. We have created a table called users

## Bulk import the mock data into the users table

1. In the OS cmd, enter command: `psql listings < location\to\import-mock-data.sql admin`

    - _where: `listings` is the database name, `admin` is the owner of the database._

    **Note: On Windows, the PostgreSQL install `\bin` directory path needs to be added to the PATH environment variable**
    **Note^2: You may have to use sudo in Linux environments.**

2. We can check the data was successfully imported by connecting to the database in `psql`, and entering command `SELECT * FROM users`
    - _where: `users` is the table name_

## References

-   PostgreSQL set-up, user creation and table creation from [nodejs-expressjs-postgresql-crud-rest-api-example](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/)
-   PostgreSQL [official docs](https://www.postgresql.org/docs/8.1/)
-   File import [reference](https://stackoverflow.com/a/6842496)
