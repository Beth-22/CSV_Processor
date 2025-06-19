import express from "express";
import path from "path";
import uploadRouter from "./routes/uploadRoute";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve result files publicly
app.use("/results", express.static(path.join(__dirname, "../results"))); //os regardless

app.use(cors());

// Routes
app.use("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
