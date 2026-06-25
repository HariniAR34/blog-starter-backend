import slugify from 'slugify'
import Blog from '../models/Blog.js'

const parseArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

const getBlogs = async (req, res) => {
  const { search = '', category = '', featured, page = 1, limit = 9 } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ]
  }

  if (category) {
    query.category = category
  }

  if (featured === 'true') {
    query.featured = true
  }

  const pageNumber = Number(page)
  const pageSize = Number(limit)

  const [blogs, total] = await Promise.all([
    Blog.find(query).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
    Blog.countDocuments(query),
  ])

  res.json({ blogs, page: pageNumber, total, totalPages: Math.ceil(total / pageSize) })
}

const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  res.json(blog)
}

const createBlog = async (req, res) => {
  const title = req.body.title?.trim()
  const slug = slugify(title || '', { lower: true, strict: true })

  const blog = await Blog.create({
    title,
    slug,
    content: req.body.content,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || '',
    category: req.body.category || 'General',
    tags: parseArray(req.body.tags),
    featured: req.body.featured === 'true' || req.body.featured === true,
  })

  res.status(201).json(blog)
}

const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  const nextTitle = req.body.title?.trim() || blog.title
  blog.title = nextTitle
  blog.slug = slugify(nextTitle, { lower: true, strict: true })
  blog.content = req.body.content ?? blog.content
  blog.image = req.file ? `/uploads/${req.file.filename}` : req.body.image ?? blog.image
  blog.category = req.body.category ?? blog.category
  blog.tags = req.body.tags ? parseArray(req.body.tags) : blog.tags
  blog.featured = req.body.featured !== undefined ? req.body.featured === 'true' || req.body.featured === true : blog.featured

  const updatedBlog = await blog.save()
  res.json(updatedBlog)
}

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  await blog.deleteOne()
  res.json({ message: 'Blog deleted' })
}

const getCategories = async (_req, res) => {
  const categories = await Blog.distinct('category')
  res.json(categories.sort())
}

export { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, getCategories }