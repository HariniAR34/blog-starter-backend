import express from 'express'
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from '../controllers/projectController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.route('/').get(getProjects).post(protect, adminOnly, upload.single('image'), createProject)
router.route('/:id').get(getProjectById).put(protect, adminOnly, upload.single('image'), updateProject).delete(protect, adminOnly, deleteProject)

export default router