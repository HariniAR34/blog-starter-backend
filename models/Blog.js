import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Blog', blogSchema)