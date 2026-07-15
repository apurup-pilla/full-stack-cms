const path = require('path');
const fs = require('fs');
const prisma = require('../config/db');

async function getAll(req, res) {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: { uploader: { select: { name: true } } },
    });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function upload(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  try {
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.id,
      },
    });
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function remove(req, res) {
  try {
    const media = await prisma.media.findUnique({ where: { id: Number(req.params.id) } });
    if (!media) return res.status(404).json({ message: 'Media not found.' });

    const filePath = path.join(__dirname, '../../uploads', media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.media.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Media deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

module.exports = { getAll, upload, remove };
