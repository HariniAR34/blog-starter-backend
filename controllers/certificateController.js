import Certificate from '../models/Certificate.js'

const getCertificates = async (_req, res) => {
  const certificates = await Certificate.find().sort({ issueDate: -1, createdAt: -1 })
  res.json(certificates)
}

const getCertificateById = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' })
  }

  res.json(certificate)
}

const createCertificate = async (req, res) => {
  const certificate = await Certificate.create({
    title: req.body.title,
    issuer: req.body.issuer,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || '',
    issueDate: req.body.issueDate,
  })

  res.status(201).json(certificate)
}

const updateCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' })
  }

  certificate.title = req.body.title ?? certificate.title
  certificate.issuer = req.body.issuer ?? certificate.issuer
  certificate.image = req.file ? `/uploads/${req.file.filename}` : req.body.image ?? certificate.image
  certificate.issueDate = req.body.issueDate ?? certificate.issueDate

  const updatedCertificate = await certificate.save()
  res.json(updatedCertificate)
}

const deleteCertificate = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' })
  }

  await certificate.deleteOne()
  res.json({ message: 'Certificate deleted' })
}

export { getCertificates, getCertificateById, createCertificate, updateCertificate, deleteCertificate }