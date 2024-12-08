import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    enum: [1, 2, 3], // 1 = user, 2 = admin, 3 = SP
    default: 1 // Default to 'user'
  }
});

const User = mongoose.model('User', userSchema);
export default User;
