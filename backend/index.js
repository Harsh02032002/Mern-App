const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet"); // ✅ helmet import
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

// ✅ Helmet Security
app.use(
  helmet({
    contentSecurityPolicy: false, // React inline scripts ke liye disable
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://full-stack-e-commerce-site-yrlu.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Connected to DB");
    console.log("🚀 Server is running on " + PORT);
  });
});
