import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'
import day from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
day.extend(advancedFormat)

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, jobStatus }) => {

  const date = day(createdAt).format('MMM Do, YYYY')

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          {/* custom component  */}
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          {/* pending, inerview, declined classes in main css */}
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>

        <footer className="actions">
          {/* <Link to={`/dashboard/edit-job`} className="btn edit-btn"> */}
          <Link to={`../edit-job/${_id}`} className="btn edit-btn">
            Edit
          </Link>
          {/* 
            * default behaviour sent back to the same page 
            * if we do not add the action then it will be 
            * sent back to the same page - like on the edit page 
            * in the edit page the aciton is located on the same page 
            * 
            * here we do not provide the action 
            * it sends back to all jobs as this is where the componet is located
            * 
            * now we explicitly send it to delete jobs
            * 
          
          */}
          {/* we submit to delete jobs page and send the param to that js page */}
          <Form method="post" action={`../delete-job/${_id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  )
}

// guest || user

export default Job
