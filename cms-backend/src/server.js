require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes       = require('./routes/auth.routes');
const userRoutes       = require('./routes/users.routes');
const pageRoutes       = require('./routes/pages.routes');
const categoryRoutes   = require('./routes/categories.routes');
const mediaRoutes      = require('./routes/media.routes');
const publicRoutes     = require('./routes/public.routes');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: [ process.env.CLIENT_URL || 'http://localhost:5173',  'http://localhost:5174'] }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/pages',      pageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media',      mediaRoutes);
app.use('/api/public',     publicRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
