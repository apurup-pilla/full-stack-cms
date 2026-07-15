const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const SAFE_SELECT = { id: true, name: true, email: true, role: true, status: true, createdAt: true };

async function getAll(req, res) {
  const { search, role, status } = req.query;
  const where = {};
  if (role)   where.role = role;
  if (status) where.status = status;
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];

  try {
    const users = await prisma.user.findMany({ where, select: SAFE_SELECT, orderBy: { createdAt: 'desc' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function getById(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select: SAFE_SELECT });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function create(req, res) {
  const { name, email, password, role = 'Viewer' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
    res.status(201).json({ message: 'User created.', userId: user.id });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Email already in use.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function update(req, res) {
  const { name, email, role, status, password } = req.body;
  try {
    const data = {};
    if (name)     data.name = name;
    if (email)    data.email = email;
    if (role)     data.role = role;
    if (status)   data.status = status;
    if (password) data.password = await bcrypt.hash(password, 10);

    if (Object.keys(data).length === 0) return res.status(400).json({ message: 'No fields to update.' });

    await prisma.user.update({ where: { id: Number(req.params.id) }, data });
    res.json({ message: 'User updated.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

module.exports = { getAll, getById, create, update, remove };
