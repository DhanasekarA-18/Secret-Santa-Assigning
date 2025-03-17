import { useState } from "react";
import styles from "../styles/Home.module.css";
import * as XLSX from "xlsx";

export default function ResultsDisplay({ results }) {
  const [downloadClicked, setDownloadClicked] = useState(false);

  const handleDownload = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(results);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Secret Santa Assignments");

    // Generate Excel file
    XLSX.writeFile(
      wb,
      `secret_santa_assignments_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    setDownloadClicked(true);

    // Reset download status after 3 seconds
    setTimeout(() => {
      setDownloadClicked(false);
    }, 3000);
  };

  return (
    <div className={styles.results}>
      <h2>Secret Santa Assignments</h2>

      <div className={styles.tableContainer}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Employee Email</th>
              <th>Secret Child Name</th>
              <th>Secret Child Email</th>
            </tr>
          </thead>
          <tbody>
            {results.map((assignment, index) => (
              <tr key={index}>
                <td>{assignment.Employee_Name}</td>
                <td>{assignment.Employee_EmailID}</td>
                <td>{assignment.Secret_Child_Name}</td>
                <td>{assignment.Secret_Child_EmailID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className={`${styles.button} ${
          downloadClicked ? styles.downloadClicked : ""
        }`}
        onClick={handleDownload}
      >
        {downloadClicked ? "Downloaded!" : "Download Excel"}
      </button>
    </div>
  );
}
