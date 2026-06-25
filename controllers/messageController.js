import Message from '../models/Message.js'

const createMessage = async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const newMessage = await Message.create({ name, email, subject, message })
  res.status(201).json({
    message: 'Message sent successfully',
    data: newMessage,
  })
}

const getMessages = async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 })
  res.json(messages)
}

const updateMessage = async (req, res) => {
  const message = await Message.findById(req.params.id)
  if (!message) {
    return res.status(404).json({ message: 'Message not found' })
  }

  message.readStatus = req.body.readStatus ?? message.readStatus
  const updatedMessage = await message.save()
  res.json(updatedMessage)
}

const deleteMessage = async (req, res) => {
  const message = await Message.findById(req.params.id)
  if (!message) {
    return res.status(404).json({ message: 'Message not found' })
  }

  await message.deleteOne()
  res.json({ message: 'Message deleted' })
}

export { createMessage, getMessages, updateMessage, deleteMessage }