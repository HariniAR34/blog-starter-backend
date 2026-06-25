import Project from '../models/Project.js'

const parseArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

const getProjects = async (req, res) => {
  const { search = '', tech = '', featured, page = 1, limit = 12 } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  if (tech) {
    query.technologies = { $in: [tech] }
  }

  if (featured === 'true') {
    query.featured = true
  }

  const pageNumber = Number(page)
  const pageSize = Number(limit)

  const [projects, total] = await Promise.all([
    Project.find(query).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
    Project.countDocuments(query),
  ])

  res.json({
    projects,
    page: pageNumber,
    total,
    totalPages: Math.ceil(total / pageSize),
  })
}

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    return res.status(404).json({ message: 'Project not found' })
  }

  res.json(project)
}

const createProject = async (req, res) => {
  const { title, description, githubLink, liveLink, featured } = req.body
  const project = await Project.create({
    title,
    description,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || '',
    technologies: parseArray(req.body.technologies),
    githubLink,
    liveLink,
    featured: featured === 'true' || featured === true,
  })

  res.status(201).json(project)
}

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    return res.status(404).json({ message: 'Project not found' })
  }

  project.title = req.body.title ?? project.title
  project.description = req.body.description ?? project.description
  project.image = req.file ? `/uploads/${req.file.filename}` : req.body.image ?? project.image
  project.technologies = req.body.technologies ? parseArray(req.body.technologies) : project.technologies
  project.githubLink = req.body.githubLink ?? project.githubLink
  project.liveLink = req.body.liveLink ?? project.liveLink
  project.featured = req.body.featured !== undefined ? req.body.featured === 'true' || req.body.featured === true : project.featured

  const updatedProject = await project.save()
  res.json(updatedProject)
}

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    return res.status(404).json({ message: 'Project not found' })
  }

  await project.deleteOne()
  res.json({ message: 'Project deleted' })
}

export { getProjects, getProjectById, createProject, updateProject, deleteProject }