const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { default: mongoose } = require("mongoose");

const cors = require("./middlewares/cors");
const useMulter = require("./middlewares/useMulter");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./graphql/schema");
const auth = require("./middlewares/auth");
const clearImage = require("./utils/clearImage");
const AppError = require("./middlewares/errorHandler");
// const resolvers = require("./graphql/resolvers");
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

app.use(auth);
app.put("/post-image", (req, res) => {
  if (!req.isAuthenticated) throw new AppError("Unauthorized", 401);
  if (!req.file) return res.status(200).json({ message: "No file provided!" });
  if (req.body.oldPath) clearImage(req.body.oldPath);
  const normalizedPath = req.file.path.split(path.sep).join("/");

  return res
    .status(201)
    .json({ message: "File stored", filePath: normalizedPath });
});

app.use(
  "/graphql",
  createHandler({
    schema,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const statusCode = err.originalError.statusCode;
      const message = err.message;
      return { data, statusCode, message };
    },
    context: (req) => {
      return {
        isAuthenticated: req.raw.isAuthenticated, // Assuming you're using passport or similar
        userId: req.raw.userId,
      };
    },
  })
);

// app.use(
//   "/graphiql",
//   createGraphiQLHandler({
//     graphqlEndpoint: "/graphql",
//   })
// );

// Error handling middleware
app.use((err, req, res, _next) => {
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
