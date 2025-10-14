"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.approveLoanApplication = exports.verifyLoanApplication = exports.getUserLoanApplications = exports.deleteLoanApplication = exports.updateLoanApplication = exports.getLoanApplicationById = exports.getLoanApplications = exports.createLoanApplication = void 0;
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const createLoanApplication = async (req, res) => {
    try {
        const loanData = {
            ...req.body,
            userId: req.user?.userId
        };
        const loanApplication = new LoanApplication_1.default(loanData);
        await loanApplication.save();
        res.status(201).json({
            message: 'Loan application submitted successfully',
            loanApplication
        });
    }
    catch (error) {
        console.error('Create loan application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createLoanApplication = createLoanApplication;
const getLoanApplications = async (req, res) => {
    try {
        const user = req.user;
        let query = {};
        if (user?.role === 'borrower') {
            query = { userId: user?.userId };
        }
        const loanApplications = await LoanApplication_1.default.find(query)
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        res.json({ loanApplications });
    }
    catch (error) {
        console.error('Get loan applications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLoanApplications = getLoanApplications;
const getLoanApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const loanApplication = await LoanApplication_1.default.findById(id)
            .populate('userId', 'username email');
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json({ loanApplication });
    }
    catch (error) {
        console.error('Get loan application by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLoanApplicationById = getLoanApplicationById;
const updateLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const loanApplication = await LoanApplication_1.default.findById(id);
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updatedLoanApplication = await LoanApplication_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('userId', 'username email');
        res.json({
            message: 'Loan application updated successfully',
            loanApplication: updatedLoanApplication
        });
    }
    catch (error) {
        console.error('Update loan application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateLoanApplication = updateLoanApplication;
const deleteLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const loanApplication = await LoanApplication_1.default.findById(id);
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await LoanApplication_1.default.findByIdAndDelete(id);
        res.json({ message: 'Loan application deleted successfully' });
    }
    catch (error) {
        console.error('Delete loan application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteLoanApplication = deleteLoanApplication;
const getUserLoanApplications = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const loanApplications = await LoanApplication_1.default.find({ userId: user.userId })
            .sort({ createdAt: -1 });
        res.json({ applications: loanApplications });
    }
    catch (error) {
        console.error('Get user loan applications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserLoanApplications = getUserLoanApplications;
const verifyLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, rejectionReason } = req.body;
        const user = req.user;
        if (user?.role !== 'verifier' && user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const loanApplication = await LoanApplication_1.default.findById(id);
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        if (loanApplication.status !== 'pending') {
            return res.status(400).json({ message: 'Application is not in pending status' });
        }
        const updateData = {};
        if (action === 'verify') {
            updateData.status = 'under_review';
        }
        else if (action === 'reject') {
            updateData.status = 'rejected';
            updateData.reviewNotes = rejectionReason;
        }
        else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        const updatedApplication = await LoanApplication_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('userId', 'username email');
        res.json({
            message: `Application ${action}ed successfully`,
            application: updatedApplication
        });
    }
    catch (error) {
        console.error('Verify loan application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.verifyLoanApplication = verifyLoanApplication;
const approveLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, rejectionReason } = req.body;
        const user = req.user;
        if (user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const loanApplication = await LoanApplication_1.default.findById(id);
        if (!loanApplication) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        if (loanApplication.status !== 'under_review') {
            return res.status(400).json({ message: 'Application must be under review before approval' });
        }
        const updateData = {};
        if (action === 'approve') {
            updateData.status = 'approved';
        }
        else if (action === 'reject') {
            updateData.status = 'rejected';
            updateData.reviewNotes = rejectionReason;
        }
        else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        const updatedApplication = await LoanApplication_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('userId', 'username email');
        res.json({
            message: `Application ${action}d successfully`,
            application: updatedApplication
        });
    }
    catch (error) {
        console.error('Approve loan application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.approveLoanApplication = approveLoanApplication;
const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        let stats = {};
        if (user?.role === 'admin' || user?.role === 'verifier') {
            const totalApplications = await LoanApplication_1.default.countDocuments();
            const pendingApplications = await LoanApplication_1.default.countDocuments({ status: 'pending' });
            const verifiedApplications = await LoanApplication_1.default.countDocuments({ status: 'under_review' });
            const approvedApplications = await LoanApplication_1.default.countDocuments({ status: 'approved' });
            const rejectedApplications = await LoanApplication_1.default.countDocuments({ status: 'rejected' });
            stats = {
                totalApplications,
                pendingApplications,
                verifiedApplications,
                approvedApplications,
                rejectedApplications
            };
        }
        else {
            const totalApplications = await LoanApplication_1.default.countDocuments({ userId: user?.userId });
            const pendingApplications = await LoanApplication_1.default.countDocuments({ userId: user?.userId, status: 'pending' });
            const verifiedApplications = await LoanApplication_1.default.countDocuments({ userId: user?.userId, status: 'under_review' });
            const approvedApplications = await LoanApplication_1.default.countDocuments({ userId: user?.userId, status: 'approved' });
            const rejectedApplications = await LoanApplication_1.default.countDocuments({ userId: user?.userId, status: 'rejected' });
            stats = {
                totalApplications,
                pendingApplications,
                verifiedApplications,
                approvedApplications,
                rejectedApplications
            };
        }
        res.json({ stats });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
