// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import ResultsDisplay from "@/components/ResultDisplay";

export default function Home() {
  const [currentEmployees, setCurrentEmployees] = useState(null);
  const [previousAssignments, setPreviousAssignments] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCurrentEmployeesUpload = (data) => {
    setCurrentEmployees(data);
    if (!data) {
      setResults(null); // Clear results when removing the employee data
    }
    setError("");
  };

  const handlePreviousAssignmentsUpload = (data) => {
    setPreviousAssignments(data);
    setError("");
  };

  const processSecretSanta = async () => {
    if (!currentEmployees) {
      setError("Please upload current employees Excel file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/process-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employees: currentEmployees,
          previousAssignments: previousAssignments || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to process Secret Santa assignments"
        );
      }

      const data = await response.json();
      setResults(data.assignments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Acme Secret Santa</title>
        <meta
          name="description"
          content="Secret Santa assignment generator for Acme"
        />
        <link rel="icon" href="/santa.jpg" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Acme Secret Santa Generator</h1>
          <Image src={"/santa.jpg"} width={50} height={50} alt={"santa"} />
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Current Employees</h2>
            <FileUpload
              onDataProcessed={handleCurrentEmployeesUpload}
              label="Current Employees Excel"
              required={true}
            />
            {currentEmployees && (
              <p>{currentEmployees.length} employees loaded</p>
            )}
          </div>

          <div className={styles.card}>
            <h2>Previous Assignments</h2>
            <FileUpload
              onDataProcessed={handlePreviousAssignmentsUpload}
              label="Previous Assignments Excel"
              required={false}
            />
            {previousAssignments && (
              <p>{previousAssignments.length} previous assignments loaded</p>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={processSecretSanta}
            disabled={loading || !currentEmployees}
          >
            {loading ? "Processing..." : "Generate Secret Santa Assignments"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        {results && <ResultsDisplay results={results} />}
      </main>
    </Layout>
  );
}
