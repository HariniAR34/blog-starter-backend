import Blog from '../models/Blog.js'
import Certificate from '../models/Certificate.js'
import Message from '../models/Message.js'
import Project from '../models/Project.js'

const getDashboardStats = async (_req, res) => {
  const [blogs, projects, messages, unreadMessages, certificates] = await Promise.all([
    Blog.countDocuments(),
    Project.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ readStatus: false }),
    Certificate.countDocuments(),
  ])

  res.json({ blogs, projects, messages, unreadMessages, certificates })
}

export { getDashboardStats }