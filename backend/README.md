
# Certificate Management System - Backend

This is the backend API for the Certificate Management System. It provides endpoints for managing employees and certificates.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the MongoDB connection string
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Certificates

- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:id` - Get certificate by ID
- `GET /api/employees/:employeeId/certificates` - Get certificates for specific employee
- `POST /api/certificates` - Create a new certificate
- `PUT /api/certificates/:id` - Update certificate
- `DELETE /api/certificates/:id` - Delete certificate

## Data Models

### Employee

```typescript
{
  name: string;
  email: string;
  cpf: string;
  role: string;
  photo?: string;
  status: 'active' | 'inactive';
}
```

### Certificate

```typescript
{
  title: string;
  type: string;
  employeeId: ObjectId;
  issuedDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'expiring';
  qrCode?: string;
  document?: string;
}
```
