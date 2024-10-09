import Wrapper from '../assets/wrappers/JobInfo'

const JobInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="job-icon test">{icon}</span>
      <span className="job-text">{text}</span>
    </Wrapper>
  )
}

export default JobInfo
