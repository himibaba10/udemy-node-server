const cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // This is checked for GraphQL
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

module.exports = cors;
