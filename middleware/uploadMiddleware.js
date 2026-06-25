import fs from 'fs'
import path from 'path'
import multer from 'multer'

const uploadsDir = path.resolve('uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`)
  },
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
    return
  }

  cb(new Error('Only image uploads are allowed'))
}

const upload = multer({ storage, fileFilter })

export default upload