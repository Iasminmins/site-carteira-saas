
import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  cpf: string;
  role: string;
  photo?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    cpf: {
      type: String,
      required: [true, 'CPF é obrigatório'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Função é obrigatória'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for certificates
EmployeeSchema.virtual('certificates', {
  ref: 'Certificate',
  localField: '_id',
  foreignField: 'employeeId',
  justOne: false,
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
