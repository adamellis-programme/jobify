import Job from '../models/jobModel.js'
import User from '../models/UserModel.js'
import { StatusCodes } from 'http-status-codes'

import cloudinary from 'cloudinary'
// for removing the image we use:
//  promises from file system so we do not have to use the callback aproach we just sstick await infront of it
import { promises as fs } from 'fs'

// use the token to get data
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
  delete newUser.password // just in case it exists!

  if (req.file) {
    // ret an obj -> we grab the values
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    console.log(response)
    await fs.unlink(req.file.path) // remove the file

    // remove the image user uploaded before
    newUser.avatar = response.secure_url
    newUser.avatarPublicId = response.public_id

    console.log('pub id = ', newUser.avatarPublicId)
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser)
  console.log(newUser)

  // we return old instance of updatedUser so we can check if there is an
  // old image on the clowdinary server with the same id

  if (req.file && updatedUser.avatarPublicId) {
    // it looks for the updatedUser.avatarPublicId
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId)
  }
  res.status(StatusCodes.OK).json({ msg: 'user updated' })
}
