
import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  title: string;
  type: string;
  employeeId: mongoose.Types.ObjectId;
  issuedDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'expiring';
  qrCode?: string;
  document?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Tipo é obrigatório'],
      trim: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Funcionário é obrigatório'],
    },
    issuedDate: {
      type: Date,
      required: [true, 'Data de emissão é obrigatória'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Data de validade é obrigatória'],
    },
    status: {
      type: String,
      enum: ['valid', 'expired', 'expiring'],
      default: 'valid',
    },
    qrCode: {
      type: String,
      default: '',
    },
    document: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate status before save
CertificateSchema.pre('save', function (next) {
  const now = new Date();
  const expiresIn = Math.ceil((this.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)); // days

  if (expiresIn <= 0) {
    this.status = 'expired';
  } else if (expiresIn <= 30) {
    this.status = 'expiring';
  } else {
    this.status = 'valid';
  }

  next();
});

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
