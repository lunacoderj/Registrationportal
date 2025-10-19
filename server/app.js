const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const registerRoute = require("./routes/register");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/register", registerRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
