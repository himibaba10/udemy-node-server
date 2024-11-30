const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const { default: mongoose } = require("mongoose");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node learner!");
});

mongoose
  .connect(
    "mongodb+srv://himibaba10:PDSc0wmxY1wiVn65@cluster0.jtbd7.mongodb.net/node-rest"
  )
  .then(() => {
    app.listen(8080, () => {
      console.log("The port is running on 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
