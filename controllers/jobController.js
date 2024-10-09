// import { nanoid } from 'nanoid'
import Job from '../models/jobModel.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import day from 'dayjs'

// params on f/e query on b/e
// inject
export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query

  // constructing the object -> if search exists add it to the object
  const queryObject = {
    createdBy: req.user.userId,
  }
  // only add it if it exists
  // if search exists add the $or array to the search
  if (search) {
    // queryObject.position = req.query.search
    queryObject.$or = [
      // array with two objects
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ]
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  }

  const sortKey = sortOptions[sort] || sortOptions.newest

  /**
   * 1st page 1 - 1 = 0 * anything is ZERO -> we do not skip any pages, we still have a limit of 10 so we retrun 10
   * 2nd page 2 - 1 = 1 * 10 = 10 -> we skip the first 10 jobs (the ones we showcased on the first page)
   */

  // setup pagination - strings to numbers
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  // queryObject.position = req.query.search: saying FIND for position: 'full-time'
  const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit)

  // PAGINATION

  const totalJobs = await Job.countDocuments(queryObject)
  // celi as: 89 10 a page, jobs we do not want to return 8.9 pages so we return 8 pages with 10 jobs amd the last one with 9
  const numOfPages = Math.ceil(totalJobs / limit)

  // set current page to page
  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage: page, jobs })
}

// we can skip the destructuring as there will be a validation layer in the model on top of the controller
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
  res.status(StatusCodes.OK).json({ job })
}
// errors now in middleware
export const updateJob = async (req, res) => {
  // pass in req.body as we have mongoose validation layer + req.body is an obj
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    // new means return the updated job not the old one
    new: true,
  })

  res.status(StatusCodes.OK).json({ updatedJob })
}

// by the time we get to the controller a lot of the functionalaty will be taken care of
export const deleteJob = async (req, res) => {
  const removedJob = await Job.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).json({ removedJob })
}

// called in the job router
export const showStats = async (req, res) => {
  // call aggregate on the Job Method
  let stats = await Job.aggregate([
    // objectId converts string id to an object id
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // next stage group by job status and count
    // stage two -> For each unique jobStatus, calculate the count by summing 1 for each document in that group.
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ])

  // console.log('stats => ', stats)

  // first param is what we return
  // id-> alias as title
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  // console.log('stats => ', stats)

  // 0 if just signed up
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }

  let monthlyApplications = await Job.aggregate([
    // get jobs belong to specific user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        // id set = to an object NOT $stats etc
        // year and month is set to createdAt
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        // we see in the console how many jobs reference the month and the year
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item

      // dayJs to format the date
      // -1 day js starts at 0 mongo starts at 1
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY')
      return { date, count }
    })
    // in the aggregate we counted down so now we reverse the map
    // all tested in the thunder client
    .reverse()

  // count: { $sum: 1 } is used to count the number of jobs in each group. The $sum: 1 operation increments the count by 1 for each job in the group, so the total number of jobs per year-month combination will be stored in the count field.

  // let monthlyApplications = [
  //   {
  //     date: 'May 23',
  //     count: 12,
  //   },
  //   {
  //     date: 'Jun 23',
  //     count: 9,
  //   },
  //   {
  //     date: 'Jul 23',
  //     count: 3,
  //   },
  // ]
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}
