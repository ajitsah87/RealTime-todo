const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require('socket.io');
require("dotenv").config();

const routes = require("./routes/ToDoRoutes");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://real-time-todo.vercel.app", // Update this to match your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('todoChange', ({ action, data }) => {
    // Broadcast the change to all other clients
    socket.broadcast.emit('todoUpdate', { action, data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

server.listen(PORT, () => console.log(`Listening at ${PORT}...`));