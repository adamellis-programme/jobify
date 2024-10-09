import Job from '../models/jobModel.js'
import User from '../models/userModel.js'
import { StatusCodes } from 'http-status-codes'

import cloudinary from 'cloudinary'

import { promises as fs } from 'fs'

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  const userWithoutPassword = user.toJSON()
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments()
  const jobs = await Job.countDocuments()
  res.status(StatusCodes.OK).json({ users, jobs })
}

export const updateUser = async (req, res) => {
  console.log(req.file)
  const newUser = { ...req.body }
  delete newUser.password

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    console.log(response)
    await fs.unlink(req.file.path)

    newUser.avatar = response.secure_url
    newUser.avatarPublicId = response.public_id

    console.log('pub id = ', newUser.avatarPublicId)
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser)
  console.log(newUser)

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId)
  }
  res.status(StatusCodes.OK).json({ msg: 'user updated' })
}
