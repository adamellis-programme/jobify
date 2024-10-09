import { Logo, FormRow, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/RegisterAndLoginPage'
import { Form, redirect, Link } from 'react-router-dom'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'
// export const action = async (data) => {
//   console.log(data)

//   return null
// }

// form data uses the name attrubutes
// empty values set on server

// USE THE NETWORK TAB TO SEE THE MESSAGE SENT BACK AND SEE THE STATUS CODE

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    // only use re-direct in the action
    await customFetch.post('/auth/register', data)
    toast.success('Registration successful')
    return redirect('/login')
  } catch (error) {
    console.log(error)
    // optinal chaining incase we get axios error
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        {/* boolean */}
        <SubmitBtn formBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  )
}
export default Register
