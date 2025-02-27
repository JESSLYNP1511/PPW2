const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const http = require("http"); // Tambahkan ini
const socketIo = require("socket.io"); // Tambahkan ini

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session untuk autentikasi
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware untuk mengatur user ke res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Set up EJS sebagai template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Menyajikan folder public (CSS, JS, dll.)
app.use(express.static(path.join(__dirname, "views")));

// Rute halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});



// Rute Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Import rute autentikasi dan tugas
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Inisialisasi server HTTP
const server = http.createServer(app);
const io = socketIo(server);

// Konfigurasi Socket.io
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Rute untuk menambahkan tugas dengan WebSocket
app.post("/tasks", async (req, res) => {
  const task = { title: req.body.title, category: req.body.category };
  // Simpan ke database...
  io.emit("newTask", task);
  res.status(201).json(task);
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
