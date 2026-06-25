import express from 'express'
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  getCategories,
  updateBlog,
} from '../controllers/blogController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/categories', getCategories)
router.get('/:slug', getBlogBySlug)
router.route('/').get(getBlogs).post(protect, adminOnly, upload.single('image'), createBlog)
router.route('/admin/:id').put(protect, adminOnly, upload.single('image'), updateBlog).delete(protect, adminOnly, deleteBlog)

export default router