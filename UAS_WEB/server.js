const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session untuk menyimpan token
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Halaman login
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

// Proses login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post("http://localhost:3000/api/login", {
      email,
      password,
    });

    req.session.token = response.data.token;
    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: "Login gagal. Periksa email dan password!" });
  }
});

// Halaman dashboard (hanya bisa diakses jika sudah login)
app.get("/dashboard", async (req, res) => {
  if (!req.session.token) {
    return res.redirect("/");
  }

  try {
    const response = await axios.get("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${req.session.token}` },
    });

    res.render("dashboard", { tasks: response.data });
  } catch (error) {
    res.render("dashboard", { tasks: [] });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
