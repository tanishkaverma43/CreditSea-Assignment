import express from 'express';
import { 
  createLoanApplication, 
  getLoanApplications, 
  getLoanApplicationById, 
  updateLoanApplication,
  deleteLoanApplication,
  getUserLoanApplications,
  verifyLoanApplication,
  approveLoanApplication,
  getDashboardStats
} from '../controllers/loanController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createLoanApplication);
router.get('/', getLoanApplications);
router.get('/user', getUserLoanApplications);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getLoanApplicationById);
router.put('/:id', updateLoanApplication);
router.put('/:id/verify', verifyLoanApplication);
router.put('/:id/approve', approveLoanApplication);
router.delete('/:id', deleteLoanApplication);

export default router;
