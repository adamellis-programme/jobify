import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useLoaderData } from 'react-router-dom'
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants'
import { Form, redirect, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { BsCloudLightning } from 'react-icons/bs'

export const loader = async ({ params }) => {
  console.log(params)
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`)
    console.log(data)
    return data
  } catch (error) {
    toast.error(error.response.data.msg)
    return redirect('/dashboard/all-jobs')
  }
}

export const action = async ({ request, params }) => {
  const formData = await request.formData()
  console.log(formData)
  const data = Object.fromEntries(formData)
  console.log(data)

  try {
    await customFetch.patch(`/jobs/${params.id}`, data)
    toast.success('Job edited successfully')
    return redirect('/dashboard/all-jobs')
  } catch (error) {

    toast.error(error.response.data.msg)
    return error
  }
}

const EditJob = () => {
  const params = useParams()
  console.log(params)
  const { job } = useLoaderData()
  console.log(job)

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />

          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          {/* boolean */}
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default EditJob
