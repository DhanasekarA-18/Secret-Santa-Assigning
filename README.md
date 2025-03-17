# Secret Santa Generator

A Next.js application for generating Secret Santa assignments for company events. This application follows the requirements specified in the Secret Santa Game challenge for Acme company.

## Features

- Upload current employee data via Excel (.xlsx) file
- Upload previous assignments (optional) to avoid repetition
- Generate Secret Santa assignments that follow these rules:
  - An employee cannot choose themselves as their secret child
  - An employee cannot be assigned to the same secret child as in the previous year
  - Each employee must have exactly one secret child
  - Each secret child should be assigned to only one employee
- Download results as an Excel file

## Technologies Used

- Next.js 15 with Page Router
- React (Functional Components)
- XLSX library for Excel file processing
- Jest for testing

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/secret-santa-nextjs.git
cd secret-santa-nextjs
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Excel Format Requirements

### Current Employees Excel File

The Excel file for current employees should have the following columns:

- Employee_Name: The name of the employee.
- Employee_EmailID: The email ID of the employee.

Example:
| Employee_Name | Employee_EmailID |
|---------------|---------------------|
| Alice Smith | alice@acme.com |
| Bob Johnson | bob@acme.com |
| Charlie Brown | charlie@acme.com |

### Previous Assignments Excel File (Optional)

The Excel file for previous assignments should have the following columns:

- Employee_Name: The name of the employee.
- Employee_EmailID: The email ID of the employee.
- Secret_Child_Name: The name of the previously assigned secret child.
- Secret_Child_EmailID: The email ID of the previously assigned secret child.

Example:
| Employee_Name | Employee_EmailID | Secret_Child_Name| Secret_Child_EmailID |
|---------------|------------------|------------------|----------------------|
| Alice Smith | alice@acme.com | Bob Johnson | bob@acme.com |
| Bob Johnson | bob@acme.com | Charlie Brown | charlie@acme.com |
| Charlie Brown | charlie@acme.com | Alice Smith | alice@acme.com |

## Testing

Run tests using:

```bash
npm test
```

The test suite verifies:

- All employees receive an assignment
- No employee is assigned to themselves
- No secret child is assigned to multiple employees
- No employee gets the same secret child as in the previous year

## Algorithm

The Secret Santa assignment algorithm:

1. Shuffles employees to ensure randomness
2. For each employee, finds eligible secret children (not themselves, not previous assignment)
3. If no eligible children are available, attempts constraint resolution by swapping
4. Validates the final assignments to ensure all rules are followed

## Error Handling

The application handles various errors:

- Invalid file format
- Missing required columns
- Empty employee list
- Impossible constraints

## Extensibility

The application is designed to be modular and extensible:

- Separation of concerns between components
- Core business logic isolated in the secretSantaService.js
- API endpoint for processing that could be extended
- Test suite for validation
