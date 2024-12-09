import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: Number,
    enum: [1, 2, 3], // 1: User, 2: Admin, 3: Service Provider
    default: 1, // Default role is 'User'
    required: true
  }
});

const User = mongoose.model('User', userSchema);
export default User;
