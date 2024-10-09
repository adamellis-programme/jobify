import { body, param, validationResult } from 'express-validator'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/CustomErrors.js'
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js'
import mongoose from 'mongoose'
import Job from '../models/jobModel.js'
import User from '../models/UserModel.js'

// this fucntion is being called by all the below validation funtions
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
        //  this makes sure we have the 401 status code // wwe are mainly throwing 400s
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages)
        }
        /// no job and not authorized are specific messages we pass in below
        if (errorMessages[0].startsWith('Not authorized')) {
          throw new UnauthorizedError('Not authorized to access this route')
        }
        //
        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

// invoke the withValidateErrors and re-use here
// checking for enums
// Object.values gets ONLY the values which in this case are all strings
export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('company is required'),
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('job location is required'),
  body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid status value'),
  body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid job type'),
])

// export const validateIdParam = withValidationErrors([
//   param('id') // matches the :id
//     .custom((value) => {
//       // return false and then kicks back to the error message
//       return true
//     })
//     .withMessage('invalid MongoDB id'),
// ])

// export const validateIdParam = withValidationErrors([
//   param('id')
//     // THIS RETURNS TRUE / FALSE
//     // custom in params or body
//     .custom((value) => mongoose.Types.ObjectId.isValid(value))
//     .withMessage('invalid MongoDB id'),
// ])

/// ALL ASYNC FUNCTIONS RETURN A PROMISE \\\\
//   async only as we are working with the database
//    implicit return is one line explicit return is broken onto multiple lines
// throwing our own errors as we are working with the async
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value)

    // nb: we can use js Error here as we are calling the top function which has our custom errors
    // custom errors are being set up in the withValidationErrors

    // if (!isValidId) throw new Error('invalid MongoDB id')
    if (!isValidId) throw new BadRequestError('invalid MongoDB id')
    const job = await Job.findById(value)
    if (!job) throw new NotFoundError(`no job with id : ${value}`)

    const isAdmin = req.user.role === 'admin'
    const isOwner = req.user.userId === job.createdBy.toString()

    if (!isAdmin && !isOwner)
      throw new UnauthorizedError('Not authorized to access this route')
  }),
])

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new BadRequestError('email already exists')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
])

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
])

// used in the user router
export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email })
      // making sure the user is not us
      // if there is a user and that user does not equal the logged in user then that email already exists in the database
      // if there is a user and the id matches then it passes as this is us
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('email already exists')
      }
    }),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
])


