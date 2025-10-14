import mongoose, { Document, Schema } from 'mongoose';

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  loanAmount: number;
  loanTenure: number; 
  loanReason: string;
  employmentStatus: string;
  employmentAddress: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  approvedAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
  disbursementDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoanApplicationSchema = new Schema<ILoanApplication>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 1000,
    max: 1000000
  },
  loanTenure: {
    type: Number,
    required: true,
    min: 6,
    max: 60
  },
  loanReason: {
    type: String,
    required: true,
    trim: true
  },
  employmentStatus: {
    type: String,
    required: true,
    enum: ['employed', 'self-employed', 'unemployed', 'retired', 'student']
  },
  employmentAddress: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'disbursed', 'completed'],
    default: 'pending'
  },
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  approvedAmount: {
    type: Number,
    min: 0
  },
  interestRate: {
    type: Number,
    min: 0,
    max: 50
  },
  monthlyPayment: {
    type: Number,
    min: 0
  },
  disbursementDate: Date
}, {
  timestamps: true
});

export default mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);
