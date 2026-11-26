import express from 'express'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
import readData from '../data/readData.js'
import validateReport from '../validation/validateReport.js'
import multer from 'multer'

const router = express.Router()
const photoDirectory = 'data/report-photos'
router.use('/photos', express.static(photoDirectory))

router.get('/', function (request, response) {
  const reports = readData('reports.json')
  response.json(reports)
})

const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5_000_000 },
}).single('photo')

function handlePhotoUpload(request, response, next) {
  uploadPhoto(request, response, function (error) {
    if (!error) return next()
    if (!(error instanceof multer.MulterError)) return next(error)

    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'Choose a photo no larger than 5 MB.'
        : 'Upload one file using the photo field.'

    return response.status(400).json({ errors: { photo: message } })
  })
}

router.post('/', handlePhotoUpload, function (request, response) {
  const locations = readData('locations.json')
  const errors = validateReport(request.body, locations)
  const photo = request.file

  if (photo && !['image/jpeg', 'image/png'].includes(photo.mimetype)) {
    errors.photo = 'Choose a JPEG or PNG photo.'
  } else if (photo && photo.size === 0) {
    errors.photo = 'Choose a photo that is not empty.'
  } else if (photo) {
    const signature =
      photo.mimetype === 'image/png'
        ? Buffer.from('89504e470d0a1a0a', 'hex')
        : Buffer.from('ffd8ff', 'hex')
    if (!photo.buffer.subarray(0, signature.length).equals(signature)) {
      errors.photo = 'Choose a valid JPEG or PNG photo.'
    }
  }

  if (Object.keys(errors).length > 0) {
    return response.status(400).json({ errors })
  }
  const { buildingId, entranceId, floorId, category, description, observedAt } =
    request.body
  const now = new Date().toISOString()
  const id = randomUUID()
  const extension = photo?.mimetype === 'image/png' ? 'png' : 'jpg'
  const photoName = photo ? `${id}.${extension}` : null
  const report = {
    id,
    buildingId,
    entranceId: entranceId ?? null,
    floorId: floorId ?? null,
    category,
    description: description.trim(),
    observedAt,
    createdAt: now,
    updatedAt: now,
    photo: photoName
      ? {
          url: `/api/reports/photos/${photoName}`,
          alt: 'Submitted barrier photo',
        }
      : null,
    status: 'Active',
  }

  const reports = readData('reports.json')
  reports.push(report)

  const temporaryPath = `data/reports-${report.id}.tmp`
  const photoPath = photoName ? `${photoDirectory}/${photoName}` : null

  try {
    if (photoPath) {
      fs.mkdirSync(photoDirectory, { recursive: true })
      fs.writeFileSync(photoPath, photo.buffer)
    }

    fs.writeFileSync(temporaryPath, JSON.stringify(reports, null, 2) + '\n')
    fs.renameSync(temporaryPath, 'data/reports.json')
  } catch (error) {
    if (photoPath) fs.rmSync(photoPath, { force: true })
    throw error
  } finally {
    fs.rmSync(temporaryPath, { force: true })
  }
  return response.status(201).json(report)
})
export default router
