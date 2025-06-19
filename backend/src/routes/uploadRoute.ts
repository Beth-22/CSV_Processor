import express from "express";
import multer from "multer";
import path from "path";
import { processCSVFile } from "../services/csvProcessor";
import { writeResultsToCSV } from "../utils/fileUtils";
import cors from "cors";

const router = express.Router();

//upload config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, cb) => cb(null, `upload-${Date.now()}.csv`),
});

//multer setup
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" || file.originalname.endsWith(".csv"); //incase of incorrect mimetype
    cb(null, isCSV);
  },
});

//cors enabled
router.use(cors());

router.post("/", upload.single("file"), async (req, res): Promise<void> => {
  try {
    //file validation
    if (!req.file) {
      res.status(400).json({ error: "Only CSV files are allowed" });
      return;
    }

    const start = Date.now();
    const aggregatedData = await processCSVFile(req.file.path);
    const { fileName } = await writeResultsToCSV(
      aggregatedData,
      req.file.originalname
    );

    const duration = Date.now() - start;
    const fileSizeKB = Math.round(req.file.size / 1024);

    res.status(200).json({
      message: "File processed successfully",
      departments: Object.keys(aggregatedData).length,
      processingTimeMs: duration,
      fileSizeKB,
      processedFileName: fileName, 
      downloadUrl: `/results/${fileName}`,
    });
  } catch (err: any) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default router;
