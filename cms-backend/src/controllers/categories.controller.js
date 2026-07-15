const prisma = require('../config/db');

async function getAll(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { pages: true } } },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function create(req, res) {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required.' });
  }
  try {
    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Category name or slug already in use.' });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function update(req, res) {
  const { name, slug } = req.body;
  try {
    const data = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;

    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(category);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Category not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Category not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

module.exports = { getAll, create, update, remove };
