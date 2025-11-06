
import { Request, Response } from 'express';
import Certificate from '../models/certificate.model';
import mongoose from 'mongoose';

// Helper function to generate QR code URL
const generateQRCodeUrl = (certificateId: string, req?: Request): string => {
  // Try to detect the frontend URL from the request
  let baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  // If request is available, try to infer the frontend URL from the origin
  if (req && req.headers.origin) {
    baseUrl = req.headers.origin;
  }
  
  const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(certificateUrl)}`;
};

// Get all certificates
export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await Certificate.find().populate('employeeId').sort({ createdAt: -1 });
    
    // Generate QR codes for certificates that don't have one
    const certificatesWithQR = certificates.map(cert => {
      if (!cert.qrCode) {
        cert.qrCode = generateQRCodeUrl(cert._id.toString(), req);
        // Save the QR code to the database asynchronously
        cert.save().catch(err => console.error('Error saving QR code:', err));
      }
      return cert;
    });
    
    res.status(200).json(certificatesWithQR);
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
    
    // Generate QR code if it doesn't exist
    if (!certificate.qrCode) {
      certificate.qrCode = generateQRCodeUrl(certificate._id.toString(), req);
      // Save the QR code to the database asynchronously
      certificate.save().catch(err => console.error('Error saving QR code:', err));
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
    // Generate QR code URL before creating the certificate
    const certificateId = new mongoose.Types.ObjectId();
    const qrCodeUrl = generateQRCodeUrl(certificateId.toString(), req);
    
    const newCertificate = await Certificate.create({
      _id: certificateId,
      ...req.body,
      qrCode: qrCodeUrl
    });
    
    res.status(201).json(newCertificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update certificate
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    // If qrCode doesn't exist in the update, generate it
    if (!req.body.qrCode) {
      req.body.qrCode = generateQRCodeUrl(req.params.id);
    }
    
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
