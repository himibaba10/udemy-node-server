const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const { default: mongoose } = require("mongoose");
const cors = require("./middlewares/cors");
const useMulter = require("./middlewares/useMulter");
const { createSocket } = require("./socket");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(useMulter);

// For CORS
app.use(cors);

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node learner!");
});

app.use((err, req, res, next) => {
  const { message, statusCode = 500, isOperational } = err;

  if (!isOperational) {
    console.error("Unexpected Error:", err);
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
});

mongoose
  .connect(
    "mongodb+srv://himibaba10:PDSc0wmxY1wiVn65@cluster0.jtbd7.mongodb.net/node-rest"
  )
  .then(() => {
    const server = app.listen(8080, () => {
      console.log("The port is running on 8080");
    });
    const io = createSocket(server);

    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
