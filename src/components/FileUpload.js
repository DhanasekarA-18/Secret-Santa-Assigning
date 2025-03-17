import { useState } from "react";
import styles from "../styles/Home.module.css";
import * as XLSX from "xlsx";

export default function FileUpload({ onDataProcessed, label, required }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setError("");

    // Check if file is Excel format
    const validExts = [".xlsx", ".xls"];
    const fileExt = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExts.includes(fileExt)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError("Excel file appears to be empty");
          return;
        }

        // Validate expected columns for employees data
        const firstRow = jsonData[0] || {};
        if (!firstRow.Employee_Name || !firstRow.Employee_EmailID) {
          setError(
            "Excel must contain Employee_Name and Employee_EmailID columns"
          );
          return;
        }

        // Filter out empty rows
        const validData = jsonData.filter(
          (row) => row.Employee_Name && row.Employee_EmailID
        );

        onDataProcessed(validData);
        setFileUploaded(true);
      } catch (err) {
        setError(`Error processing Excel file: ${err.message}`);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleRemoveFile = () => {
    setFileName("");
    setFileUploaded(false);
    setError("");
    onDataProcessed(null);
  };

  return (
    <div className={styles.fileUpload}>
      {!fileUploaded ? (
        <>
          <label className={styles.fileLabel}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <span className={styles.fileLabelText}>
              {fileName ? fileName : `Choose ${label}`}
            </span>
            {required && <span className={styles.required}>*</span>}
          </label>
        </>
      ) : (
        <div className={styles.fileActions}>
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{fileName}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className={styles.removeButton}
            type="button"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {fileUploaded && !error && (
        <div className={styles.status}>
          <svg
            className={styles.statusIcon}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          File uploaded successfully
        </div>
      )}
    </div>
  );
}
