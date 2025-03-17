export function generateSecretSantaAssignments(
  employees,
  previousAssignments = []
) {
  if (!employees || employees.length < 2) {
    throw new Error("At least 2 employees are required for Secret Santa");
  }

  // Create map of previous assignments for quick lookup
  const previousAssignmentMap = new Map();

  if (previousAssignments && previousAssignments.length > 0) {
    previousAssignments.forEach((assignment) => {
      previousAssignmentMap.set(
        assignment.Employee_EmailID,
        assignment.Secret_Child_EmailID
      );
    });
  }

  // Maximum attempts to find a valid assignment
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      // Create a copy of employees to avoid mutating the original array
      const employeesCopy = [...employees];

      // Shuffle employees to add randomness
      shuffleArray(employeesCopy);

      // Create results array to track assignments
      const results = [];

      // Create a map of available secret children (all employees initially)
      const availableSecretChildren = new Map();
      employeesCopy.forEach((employee) => {
        availableSecretChildren.set(employee.Employee_EmailID, employee);
      });

      // Process each employee to assign a secret child
      for (const employee of employeesCopy) {
        // Get the employee's previous secret child
        const previousSecretChildEmail = previousAssignmentMap.get(
          employee.Employee_EmailID
        );

        // Find eligible secret children (everyone except themselves and previous assignment)
        const eligibleSecretChildren = Array.from(
          availableSecretChildren.values()
        ).filter(
          (child) =>
            child.Employee_EmailID !== employee.Employee_EmailID &&
            child.Employee_EmailID !== previousSecretChildEmail
        );

        // If no eligible children, we can't make a valid assignment with this shuffle
        if (eligibleSecretChildren.length === 0) {
          throw new Error("No valid assignment possible with this shuffle");
        }

        // Assign a random eligible secret child
        const randomIndex = Math.floor(
          Math.random() * eligibleSecretChildren.length
        );
        const secretChild = eligibleSecretChildren[randomIndex];

        // Remove assigned child from available pool
        availableSecretChildren.delete(secretChild.Employee_EmailID);

        // Add to results
        results.push({
          Employee_Name: employee.Employee_Name,
          Employee_EmailID: employee.Employee_EmailID,
          Secret_Child_Name: secretChild.Employee_Name,
          Secret_Child_EmailID: secretChild.Employee_EmailID,
        });
      }

      // If we've successfully created assignments for everyone, return the results
      return results;
    } catch (error) {
      // If this attempt failed, try again with a different shuffle
      continue;
    }
  }

  throw new Error(
    `Unable to generate valid Secret Santa assignments after ${maxAttempts} attempts. Consider removing some constraints.`
  );
}

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Validate the results to ensure all constraints are met
 */
export function validateAssignments(
  assignments,
  employees,
  previousAssignments = []
) {
  if (!assignments || assignments.length === 0) {
    return { valid: false, errors: ["No assignments generated"] };
  }

  const errors = [];

  // Check if all employees have an assignment
  if (assignments.length !== employees.length) {
    errors.push(
      `Assignment count (${assignments.length}) does not match employee count (${employees.length})`
    );
  }

  // Check for self-assignments
  const selfAssignments = assignments.filter(
    (a) => a.Employee_EmailID === a.Secret_Child_EmailID
  );

  if (selfAssignments.length > 0) {
    errors.push(`Found ${selfAssignments.length} self-assignments`);
  }

  // Check for duplicate secret children
  const secretChildrenEmails = assignments.map((a) => a.Secret_Child_EmailID);
  const uniqueSecretChildren = new Set(secretChildrenEmails);

  if (uniqueSecretChildren.size !== secretChildrenEmails.length) {
    errors.push("Some secret children are assigned to multiple employees");
  }

  // Check for previous year's assignments
  if (previousAssignments && previousAssignments.length > 0) {
    const previousAssignmentMap = new Map();
    previousAssignments.forEach((assignment) => {
      previousAssignmentMap.set(
        assignment.Employee_EmailID,
        assignment.Secret_Child_EmailID
      );
    });

    const repeatedAssignments = assignments.filter(
      (a) =>
        previousAssignmentMap.get(a.Employee_EmailID) === a.Secret_Child_EmailID
    );

    if (repeatedAssignments.length > 0) {
      errors.push(
        `Found ${repeatedAssignments.length} assignments that match previous year`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
