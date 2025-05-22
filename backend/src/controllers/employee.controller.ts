
import { Request, Response } from 'express';
import Employee from '../models/employee.model';

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    res.status(200).json(updatedEmployee);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    await employee.deleteOne();
    res.status(200).json({ message: 'Funcionário removido com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
