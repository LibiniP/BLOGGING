const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views")); // serve HTML files (register.html, login.html, blog.html)

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Libini@2005",
  database: "blogdb",
  port: 3306
});

db.connect(function (err) {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// -------------------- Register --------------------
app.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], function (err) {
    if (err) return res.send("Error: " + err);
    res.send("User registered successfully! <a href='login.html'>Login</a>");
  });
});

// -------------------- Login --------------------
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(sql, [username, password], function (err, result) {
    if (err) {
      console.error("❌ DB Error: ", err);
      return res.send("Error occurred!");
    }

    if (result.length > 0) {
      console.log("✅ Login success:", username);
      // Redirect to home page with user id
      res.redirect("/blog.html?user=" + result[0].id);
    } else {
      console.log("❌ Invalid login attempt:", username);
      res.send("Invalid credentials! <a href='login.html'>Try again</a>");
    }
  });
});

// -------------------- Fetch all posts for a user --------------------
app.get("/get-posts", function (req, res) {
  const user_id = req.query.user;
  db.query("SELECT * FROM posts WHERE user_id=?", [user_id], function (err, result) {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.json([]);
    }
    res.json(result);
  });
});

// -------------------- Create Post --------------------
app.post("/create-post", function (req, res) {
  const user_id = req.body.user_id;
  const title = req.body.title;
  const content = req.body.content;

  if (!user_id) {
    return res.status(400).send("Error: Missing user_id");
  }

  db.query(
    "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
    [user_id, title, content],
    function (err) {
      if (err) {
        console.error("Create Post Error:", err);
        return res.status(500).send("DB Error: " + err.sqlMessage);
      }
      res.send("OK");
    }
  );
});

// -------------------- Edit Post --------------------
app.post("/edit-post", function (req, res) {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;

  db.query(
    "UPDATE posts SET title=?, content=? WHERE id=?",
    [title, content, id],
    function (err) {
      if (err) return res.send("DB Error");
      res.send("OK");
    }
  );
});

// -------------------- Delete Post --------------------
app.post("/delete-post", function (req, res) {
  const id = req.body.id;

  db.query("DELETE FROM posts WHERE id=?", [id], function (err) {
    if (err) return res.send("DB Error");
    res.send("OK");
  });
});

// -------------------- Root --------------------
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.listen(3000, function () {
  console.log("🚀 Server running at http://localhost:3000");
});
