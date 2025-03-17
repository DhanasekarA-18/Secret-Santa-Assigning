// pages/api/process-csv.js

import {
  generateSecretSantaAssignments,
  validateAssignments,
} from "../../lib/secretSantaService";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { employees, previousAssignments } = req.body;

    // Validate input data
    if (!employees || !Array.isArray(employees) || employees.length < 2) {
      return res.status(400).json({
        error: "Invalid employees data. At least 2 employees are required.",
      });
    }

    // Generate assignments
    const assignments = generateSecretSantaAssignments(
      employees,
      previousAssignments
    );

    // Validate the generated assignments
    const validation = validateAssignments(
      assignments,
      employees,
      previousAssignments
    );

    if (!validation.valid) {
      return res.status(500).json({
        error: "Failed to generate valid assignments",
        details: validation.errors,
      });
    }

    // Return the assignments
    return res.status(200).json({ assignments });
  } catch (error) {
    console.error("Error processing Secret Santa assignments:", error);
    return res.status(500).json({ error: error.message });
  }
}
