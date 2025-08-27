# BLOGGING
A simple personal blog with user authentication, posts.

# My Mini Tech Blog

This is a small full-stack web application built with HTML, CSS, Node.js, Express, and MySQL. 

It allows users to:

- Register and log in
- Create, edit, and delete blog posts
- View posts specific to their user account
- Dynamically update the UI with JavaScript

The frontend is built with plain HTML, CSS, and vanilla JS, and the backend uses Express and MySQL for data storage.

# SETUP Guide

1) Node.js & npm – Install from https://nodejs.org/
MySQL – Install MySQL and set up a user with password.
npm install

2) Open MySQL terminal 
Create a database:
CREATE DATABASE blogdb;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password",
  database: "blogdb",
  port: 3306
});

3) Start the Server : node server.js

4) Server will run at http://localhost:3000

5) Register a new user at / (register.html)

Login at /login.html

After login, you’ll be redirected to /blog.html?user=<id> to create and manage blog posts.

6) Each user sees only their own posts.

Blog posts can be created, edited, or deleted directly from the page.

Ensure MySQL service is running before starting the server.
