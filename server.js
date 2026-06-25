import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/db.js'
import User from './models/User.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

await connectDB()

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Developer Portfolio & Blog Starter API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

const seedAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return
  }

  const existing = await User.findOne({ email })
  if (!existing) {
    await User.create({ name: 'Admin User', email, password, role: 'admin' })
    console.log('Seed admin account created')
  }
}

app.listen(PORT, async () => {
  await seedAdminUser()
  console.log(`Server running on port ${PORT}`)
})