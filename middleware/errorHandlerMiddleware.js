// same code that was in the server file app.use err middleware
// this can be written int the server we just moved it to this file 
import { StatusCodes } from 'http-status-codes'
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  // if status code is there if not use generic
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  // err message is what wr pass in the throw
  const msg = err.message || 'Something went wrong, try again later'

  res.status(statusCode).json({ msg })
  // we then see the msg we pass in our controller
}

export default errorHandlerMiddleware
