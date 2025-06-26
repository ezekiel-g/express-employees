Express Employees is a Node Express API that demonstrates interaction with a
MySQL database, showcasing a one-to-many relationship between entities.

To use this app for other MySQL database tables, change the routes in
`server.js`, the `.sql` files in `/api/v1/db` the app's name in `package.json`.

In `server.js`...

```
app.use('/api/v1/departments', createCrudRouter('departments'))
app.use('/api/v1/employees', createCrudRouter('employees'))
```

Becomes...

```
app.use('/api/v1/your_table', createCrudRouter('your_table'))
app.use('/api/v1/your_other_table', createCrudRouter('your_other_table'))
```

Create a `.env` file in the root directory file with the following:

```
PORT=3000 or another one if you have a reason
FRONT_END_URL=url of your front end app if you have one
DB_HOST=your MySQL host...default is 127.0.0.1
DB_USER=your MySQL username...default is "root"
DB_PASSWORD=the password for your MySQL database connection
DB_NAME=your MySQL database name
```

Install dependencies with `npm install`, run in development mode with
`npm run dev`.
