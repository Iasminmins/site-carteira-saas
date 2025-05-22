
import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employee.controller';
import { getCertificatesByEmployeeId } from '../controllers/certificate.controller';

const router = express.Router();

// Basic Employee routes
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Get all certificates for a specific employee
router.get('/:employeeId/certificates', getCertificatesByEmployeeId);

export default router;
