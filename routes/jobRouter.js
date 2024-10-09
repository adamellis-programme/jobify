import { Router } from 'express'
const router = Router()

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js'
import { validateJobInput, validateIdParam } from '../middleware/validationMiddleware.js'
import { checkForTestUser } from '../middleware/authMiddleware.js'
// router.get('/', getAllJobs);
// router.post('/', createJob);

// middleware checks before the controller files run

// check for checkForTestUser BEFORE validaion comes in
router.route('/').get(getAllJobs).post(checkForTestUser, validateJobInput, createJob)

// has to be passed here othrewise express thinks stats is an id
/// express reads top to bottom
router.route('/stats').get(showStats)
  
router 
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateJob)
  .delete(checkForTestUser, validateIdParam, deleteJob)

// exoprt the router here and import this router into the server
export default router
