import jwt from 'jsonwebtoken'

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
  return token
}

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}

/**
 *-: the token is sent to the frontend 
 *-: and then decoded on the backend
 *
 *-: the cookie 
 * 
 *-: jwt is sent with every request 
 *-: and will be sent in the http cookie
 *
 * 
 * 

 */
