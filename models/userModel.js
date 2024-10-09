import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  avatar: String,
  avatarPublicId: String,
})

// same as const user = await User.findById(id).select('-password')
// this points back to the INSTANCE
// converts to a js object
// when we use this.toObject(), we create a new object that contains a copy of the current object's properties.
// using this.toObject() provides additional benefits for security, performance, encapsulation, and customization when converting the object to JSON
UserSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  return obj
}

// const User = mongoose.models.User || mongoose.model('User', UserSchema)

// export default User

export default mongoose.model('User', UserSchema)
