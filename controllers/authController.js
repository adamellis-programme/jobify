import { StatusCodes } from 'http-status-codes'
import User from '../models/UserModel.js' 

import bcrypt from 'bcryptjs'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { UnauthenticatedError } from '../errors/CustomErrors.js'
import { createJWT } from '../utils/tokenUtils.js'

export const register = async (req, res) => {
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments()) === 0
  req.body.role = isFirstAccount ? 'admin' : 'user'
 
  // a random value that is added to the password before hashing
  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword

  const user = await User.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: 'user created!' })
}

export const login = async (req, res) => {
  // check if user exists
  // check if password is correct

  const user = await User.findOne({ email: req.body.email })

  // one linner
  const isValidUser = user && (await comparePassword(req.body.password, user.password))
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials')

  if (!user) throw new UnauthenticatedError('invalid credentials')

  // frontend first stores and then has to send the token to backend to be de-coded
  const token = createJWT({ userId: user._id, role: user.role })
  console.log(token)

  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('token', token, {
    httpOnly: true, // cannot be accessd with js as http only
    expires: new Date(Date.now() + oneDay), // has to be in ms
    secure: process.env.NODE_ENV === 'production', // if true then transmit only over https
    // check in the cookies tab in thunder client or postman
    // to see the cookie sent back to the server go to all routes and log the req (in the server logs we see the coookie)
    // once the cookie is set it comes back with every reqest
  })

  res.status(StatusCodes.CREATED).json({ msg: 'user logged in' })
}

export const logout = (req, res) => {
  /// logout value is irelivent 
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}
