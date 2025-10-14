import { Request, Response } from 'express';
import LoanApplication from '../models/LoanApplication';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createLoanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const loanData = {
      ...req.body,
      userId: req.user?.userId
    };

    const loanApplication = new LoanApplication(loanData);
    await loanApplication.save();

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loanApplication
    });
  } catch (error) {
    console.error('Create loan application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLoanApplications = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let query = {};

    if (user?.role === 'borrower') {
      query = { userId: user?.userId };
    }

    const loanApplications = await LoanApplication.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({ loanApplications });
  } catch (error) {
    console.error('Get loan applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLoanApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const loanApplication = await LoanApplication.findById(id)
      .populate('userId', 'username email');

    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ loanApplication });
  } catch (error) {
    console.error('Get loan application by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateLoanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedLoanApplication = await LoanApplication.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    res.json({
      message: 'Loan application updated successfully',
      loanApplication: updatedLoanApplication
    });
  } catch (error) {
    console.error('Update loan application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLoanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (user?.role === 'borrower' && loanApplication.userId.toString() !== user?.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await LoanApplication.findByIdAndDelete(id);

    res.json({ message: 'Loan application deleted successfully' });
  } catch (error) {
    console.error('Delete loan application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserLoanApplications = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const loanApplications = await LoanApplication.find({ userId: user.userId })
      .sort({ createdAt: -1 });

    res.json({ applications: loanApplications });
  } catch (error) {
    console.error('Get user loan applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyLoanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;
    const user = req.user;

    if (user?.role !== 'verifier' && user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loanApplication.status !== 'pending') {
      return res.status(400).json({ message: 'Application is not in pending status' });
    }

    const updateData: any = {};
    if (action === 'verify') {
      updateData.status = 'under_review';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.reviewNotes = rejectionReason;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    res.json({
      message: `Application ${action}ed successfully`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Verify loan application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveLoanApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;
    const user = req.user;

    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const loanApplication = await LoanApplication.findById(id);

    if (!loanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loanApplication.status !== 'under_review') {
      return res.status(400).json({ message: 'Application must be under review before approval' });
    }

    const updateData: any = {};
    if (action === 'approve') {
      updateData.status = 'approved';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.reviewNotes = rejectionReason;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    res.json({
      message: `Application ${action}d successfully`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Approve loan application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let stats = {};

    if (user?.role === 'admin' || user?.role === 'verifier') {
      const totalApplications = await LoanApplication.countDocuments();
      const pendingApplications = await LoanApplication.countDocuments({ status: 'pending' });
      const verifiedApplications = await LoanApplication.countDocuments({ status: 'under_review' });
      const approvedApplications = await LoanApplication.countDocuments({ status: 'approved' });
      const rejectedApplications = await LoanApplication.countDocuments({ status: 'rejected' });

      stats = {
        totalApplications,
        pendingApplications,
        verifiedApplications,
        approvedApplications,
        rejectedApplications
      };
    } else {    
      const totalApplications = await LoanApplication.countDocuments({ userId: user?.userId });
      const pendingApplications = await LoanApplication.countDocuments({ userId: user?.userId, status: 'pending' });
      const verifiedApplications = await LoanApplication.countDocuments({ userId: user?.userId, status: 'under_review' });
      const approvedApplications = await LoanApplication.countDocuments({ userId: user?.userId, status: 'approved' });
      const rejectedApplications = await LoanApplication.countDocuments({ userId: user?.userId, status: 'rejected' });

      stats = {
        totalApplications,
        pendingApplications,
        verifiedApplications,
        approvedApplications,
        rejectedApplications
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
