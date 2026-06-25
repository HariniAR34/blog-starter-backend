import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    technologies: [{ type: String, trim: true }],
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)