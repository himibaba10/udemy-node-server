const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { default: mongoose } = require("mongoose");

const cors = require("./middlewares/cors");
const useMulter = require("./middlewares/useMulter");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(useMulter);

// For CORS
app.use(cors);

app.get("/", (req, res) => {
  res.send("Hello, Node learner!");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
  })
);

// Error handling middleware
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
    app.listen(8080, () => {
      console.log("The port is running on 8080");
    });
  })
  .catch((err) => console.log(err));
