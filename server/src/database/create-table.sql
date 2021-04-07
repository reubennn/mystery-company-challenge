/*
 * SQL command to create the users table with id, name, email, message and created (date).
 * - We can simply copy and paste this command into the SQL Shell (psql).
 * - (make sure to connect to the correct database: `\c <database>;`)
 */
create table users (
	id INT,
	name VARCHAR(50),
	email VARCHAR(50),
	message TEXT,
	created DATE,
	pin INT
);
