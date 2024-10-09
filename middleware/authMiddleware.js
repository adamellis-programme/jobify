import { UnauthenticatedError, BadRequestError } from '../errors/CustomErrors.js'
import { verifyJWT } from '../utils/tokenUtils.js'

// we restrict the routes if the cookie is not present or the jwt is not valid
// not async as we are dealing with the client

// this is the firsh middleware that allows us to check
// if the there is a test user logged in or not
export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    throw new UnauthenticatedError('authentication invalid')
  }

  try {
    const { userId, role } = verifyJWT(token)
    // if match then true
    const testUser = userId === '6702c48fc85b9851bb1f7abb'
    req.user = { userId, role, testUser }
    next()
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid')
  }
}

// ...rest as we can pass in manager, admim, sales and then check if that rolles
// array contains what we pass in here router.get('/admin/app-stats', [authorizePermissions('admin'), getApplicationStats])
export const authorizePermissions = (...roles) => {
  console.log(roles)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}

// next passes it onto might be a controller
// added to the job router and
// not added in the server as we want to allow some access but restricted

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!')
  }
  next()
}

/**
 * register and then login a user to test the cookie being sent back to the server for validation
 *
 * TEST THE BACKEND BY USING THE THUNDER CLIENT OR POSTMAN
 * MAKE AND GET DATA (JOBS) THEN LOG OUT AND LOG IN AS ANOTHER USER AND
 * MAKE AND GET THAT DATA
 * THS TESTS THE BACKEND
 */
