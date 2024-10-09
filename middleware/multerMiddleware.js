import multer from 'multer'

// null if there is an error, then the destination
// fielname optional but we need as sending to cloudeary
// base 64 store in mongo db

// create the storage -> object with dest and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, 'public/uploads')
  },
  // opt as cloudinary but we need the original name
  filename: (req, file, cb) => {
    const fileName = file.originalname
    // set the name of the uploaded file
    cb(null, fileName)
  },
})
const upload = multer({ storage })

export default upload

// used in update user route
// and used in the user controller, we have use of req.file

// multer takes the binary and transfroms it into a req.body


