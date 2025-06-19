import { useRef, useState } from "react";
import styles from "./FileUploader.module.css";
import axios from "axios";

function FileUploader() {
  const inputRef = useRef(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  const [downloadName, setDownloadName] = useState("");

  //to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setSuccess(false);
      setResultUrl(null);
      setDownloadName("");
      setUploadProgress(0);
    } else {
      alert("Only CSV files are allowed");
    }
  };

  //uploads
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        //to backend
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
            //progress bar 
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          },
        }
      );

      setResultUrl(response.data.downloadUrl);
      setDownloadName(response.data.processedFileName);
      setSuccess(true);
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>CSV Uploader and Processor</h2>

      <div
        className={styles.dropArea}
        onClick={() => inputRef.current?.click()}
      >
        <p>
          Drag and drop a CSV file here or{" "}
          <span className={styles.browse}>Browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && !uploading && !success && (
        <p className={styles.ready}>
          Ready to upload: <strong>{selectedFile.name}</strong>
        </p>
      )}

      <button
        className={`${styles.uploadBtn} ${success ? styles.uploaded : ""}`}
        disabled={!selectedFile || uploading}
        onClick={handleUpload}
      >
        {uploading ? "Uploading..." : success ? "Uploaded!" : "Upload"}
      </button>

      {uploading && (
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {success && resultUrl && (
        <div className={styles.successBox}>
          <p className={styles.successText}>File processed successfully!</p>
          <a
            href={`http://localhost:3000${resultUrl}`}
            className={styles.downloadBtn}
            download
          >
            ⬇ {downloadName}
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
