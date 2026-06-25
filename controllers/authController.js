import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({ name, email, password, role: role || 'admin' })

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: createToken(user),
  })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: createToken(user),
  })
}

const getMe = async (req, res) => {
  return res.json({ user: req.user })
}

export { registerUser, loginUser, getMe }