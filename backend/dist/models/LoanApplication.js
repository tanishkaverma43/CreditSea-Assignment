"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const LoanApplicationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('LoanApplication', LoanApplicationSchema);
