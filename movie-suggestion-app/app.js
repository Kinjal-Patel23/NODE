const express = require("express");
const app = express();
const port = 3000;

const movieRoutes = require("./routes/movieRoutes")
app.set("view engine", "ejs");

app.use(express.static("public")); 

app.use("/", movieRoutes);

app.listen(port);