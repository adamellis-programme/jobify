import mongoose from 'mongoose'
import { JOB_STATUS } from '../utils/constants.js'
import { JOB_TYPE } from '../utils/constants.js'

// emum pre defined selection of options
const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

// collection is like a table
// here is where we name the schema Job
// we export this as we bring it into the controllers
// Job is created at jobs and then the schema is provided
// if the property is not listed here and try to add in then it wil get quietly ignored
export default mongoose.model('Job', JobSchema)
