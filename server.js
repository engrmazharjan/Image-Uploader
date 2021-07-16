const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const path = require("path");

// PORT
const port = process.env.PORT || 9000;

// Serving Static Files
app.use(express.static(path.join(__dirname, "public")));

// Connect mongodb database
require("./server/database/database.js")();

// Setup View Engine
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(__dirname, "views"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

// Calling Routes
app.use("/", require("./server/router/router.js"));

app.use(express.json());

// Listen TO Port
app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
