import express from "express";
const app = express();

// ONLY FOR TEST
app.get("/", (req, res) => res.send("OK"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
