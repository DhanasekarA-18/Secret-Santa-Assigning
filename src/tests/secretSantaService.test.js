// tests/secretSantaService.test.js
import {
  generateSecretSantaAssignments,
  validateAssignments,
} from "../lib/secretSantaService";

describe("Secret Santa Service", () => {
  const employees = [
    { Employee_Name: "Alice", Employee_EmailID: "alice@acme.com" },
    { Employee_Name: "Bob", Employee_EmailID: "bob@acme.com" },
    { Employee_Name: "Charlie", Employee_EmailID: "charlie@acme.com" },
    { Employee_Name: "Diana", Employee_EmailID: "diana@acme.com" },
    { Employee_Name: "Eve", Employee_EmailID: "eve@acme.com" },
  ];

  const previousAssignments = [
    {
      Employee_Name: "Alice",
      Employee_EmailID: "alice@acme.com",
      Secret_Child_Name: "Bob",
      Secret_Child_EmailID: "bob@acme.com",
    },
    {
      Employee_Name: "Bob",
      Employee_EmailID: "bob@acme.com",
      Secret_Child_Name: "Charlie",
      Secret_Child_EmailID: "charlie@acme.com",
    },
    {
      Employee_Name: "Charlie",
      Employee_EmailID: "charlie@acme.com",
      Secret_Child_Name: "Diana",
      Secret_Child_EmailID: "diana@acme.com",
    },
    {
      Employee_Name: "Diana",
      Employee_EmailID: "diana@acme.com",
      Secret_Child_Name: "Eve",
      Secret_Child_EmailID: "eve@acme.com",
    },
    {
      Employee_Name: "Eve",
      Employee_EmailID: "eve@acme.com",
      Secret_Child_Name: "Alice",
      Secret_Child_EmailID: "alice@acme.com",
    },
  ];

  test("should generate assignments for all employees", () => {
    const assignments = generateSecretSantaAssignments(employees);
    expect(assignments.length).toBe(employees.length);
  });

  test("should not assign employees to themselves", () => {
    const assignments = generateSecretSantaAssignments(employees);
    assignments.forEach((assignment) => {
      expect(assignment.Employee_EmailID).not.toBe(
        assignment.Secret_Child_EmailID
      );
    });
  });

  test("should not assign the same secret child to multiple employees", () => {
    const assignments = generateSecretSantaAssignments(employees);
    const secretChildren = assignments.map((a) => a.Secret_Child_EmailID);
    const uniqueSecretChildren = new Set(secretChildren);
    expect(uniqueSecretChildren.size).toBe(secretChildren.length);
  });

  test("should not assign the same secret child as previous year", () => {
    const assignments = generateSecretSantaAssignments(
      employees,
      previousAssignments
    );

    assignments.forEach((assignment) => {
      const previousAssignment = previousAssignments.find(
        (pa) => pa.Employee_EmailID === assignment.Employee_EmailID
      );

      if (previousAssignment) {
        expect(assignment.Secret_Child_EmailID).not.toBe(
          previousAssignment.Secret_Child_EmailID
        );
      }
    });
  });

  test("should validate assignments correctly", () => {
    const assignments = generateSecretSantaAssignments(employees);
    const validation = validateAssignments(assignments, employees);
    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  test("should detect invalid assignments", () => {
    // Create an invalid assignment with a duplicate secret child
    const invalidAssignments = [
      {
        Employee_Name: "Alice",
        Employee_EmailID: "alice@acme.com",
        Secret_Child_Name: "Bob",
        Secret_Child_EmailID: "bob@acme.com",
      },
      {
        Employee_Name: "Bob",
        Employee_EmailID: "bob@acme.com",
        Secret_Child_Name: "Charlie",
        Secret_Child_EmailID: "charlie@acme.com",
      },
      {
        Employee_Name: "Charlie",
        Employee_EmailID: "charlie@acme.com",
        Secret_Child_Name: "Bob",
        Secret_Child_EmailID: "bob@acme.com",
      }, // Duplicate
      {
        Employee_Name: "Diana",
        Employee_EmailID: "diana@acme.com",
        Secret_Child_Name: "Eve",
        Secret_Child_EmailID: "eve@acme.com",
      },
      {
        Employee_Name: "Eve",
        Employee_EmailID: "eve@acme.com",
        Secret_Child_Name: "Diana",
        Secret_Child_EmailID: "diana@acme.com",
      },
    ];

    const validation = validateAssignments(invalidAssignments, employees);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
