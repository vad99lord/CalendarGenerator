import express from "express";

const app = express();
const port = 3000;

app.get("/api/", (req, res) => {
  res.send("server hello");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
