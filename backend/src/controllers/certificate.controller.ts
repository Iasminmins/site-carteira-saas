import { Request, Response } from 'express';
import Certificate from '../models/certificate.model';
import mongoose from 'mongoose';

// Get all certificates
export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await Certificate.find().populate('employeeId').sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get certificate by ID
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('employeeId');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificado não encontrado' });
    }
    
    res.status(200).json(certificate);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get certificates by employee ID
export const getCertificatesByEmployeeId = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'ID de funcionário inválido' });
    }
    
    const certificates = await Certificate.find({ employeeId });
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create certificate
export const createCertificate = async (req: Request, res: Response) => {
  try {
    // O QR code será gerado no frontend automaticamente
    const newCertificate = await Certificate.create(req.body);
    
    res.status(201).json(newCertificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update certificate
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCertificate) {
      return res.status(404).json({ message: 'Certificado não encontrado' });
    }
    
    res.status(200).json(updatedCertificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete certificate
export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificado não encontrado' });
    }
    
    await certificate.deleteOne();
    res.status(200).json({ message: 'Certificado removido com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
