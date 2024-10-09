import { Router } from 'express'
const router = Router()

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js'
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js'
import { authorizePermissions, checkForTestUser } from '../middleware/authMiddleware.js'
import upload from '../middleware/multerMiddleware.js'

// [] = is an express thing it is not required it just looks nice and groups together middlewares
// as auterized permissions is invoked right away
// prefix with api/v1
router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', [authorizePermissions('admin'), getApplicationStats])
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
)
export default router

// avatar we point to the name in the form data
