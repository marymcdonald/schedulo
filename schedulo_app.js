const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Schedulo is here\n");
});

app.listen(3000, "localhost", () => {
  console.log("Listening to post 3000");
});