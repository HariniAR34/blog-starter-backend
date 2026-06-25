import express from 'express'
import {
  createCertificate,
  deleteCertificate,
  getCertificateById,
  getCertificates,
  updateCertificate,
} from '../controllers/certificateController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.route('/').get(getCertificates).post(protect, adminOnly, upload.single('image'), createCertificate)
router.route('/:id').get(getCertificateById).put(protect, adminOnly, upload.single('image'), updateCertificate).delete(protect, adminOnly, deleteCertificate)

export default router