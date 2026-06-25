import express from 'express'
import { createMessage, deleteMessage, getMessages, updateMessage } from '../controllers/messageController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createMessage)
router.route('/').get(protect, adminOnly, getMessages)
router.route('/:id').put(protect, adminOnly, updateMessage).delete(protect, adminOnly, deleteMessage)

export default router