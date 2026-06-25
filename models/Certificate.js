import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    issueDate: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)