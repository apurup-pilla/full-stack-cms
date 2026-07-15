const prisma = require('../config/db');

const WITH_RELATIONS = {
  author:   { select: { name: true } },
  category: { select: { id: true, name: true, slug: true } },
};

async function getAll(req, res) {
  const { search, status, categoryId } = req.query;
  const where = {};
  if (status)     where.status = status;
  if (categoryId) where.categoryId = Number(categoryId);
  if (search)     where.OR = [{ title: { contains: search } }, { slug: { contains: search } }];

  try {
    const pages = await prisma.page.findMany({
      where,
      include: WITH_RELATIONS,
      orderBy: { updatedAt: 'desc' },
    });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function getById(req, res) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: Number(req.params.id) },
      include: WITH_RELATIONS,
    });
    if (!page) return res.status(404).json({ message: 'Page not found.' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function create(req, res) {
  const { title, slug, content = '', status = 'draft', categoryId } = req.body;
  if (!title || !slug) return res.status(400).json({ message: 'Title and slug are required.' });

  try {
    const data = { title, slug, content, status, authorId: req.user.id };
    if (categoryId) data.categoryId = Number(categoryId);

    const page = await prisma.page.create({ data });
    res.status(201).json({ message: 'Page created.', pageId: page.id });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Slug already in use.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function update(req, res) {
  const { title, slug, content, status, categoryId } = req.body;
  try {
    const data = {};
    if (title)              data.title = title;
    if (slug)               data.slug = slug;
    if (content !== undefined) data.content = content;
    if (status)             data.status = status;
    if (categoryId !== undefined) data.categoryId = categoryId ? Number(categoryId) : null;

    if (Object.keys(data).length === 0) return res.status(400).json({ message: 'No fields to update.' });

    await prisma.page.update({ where: { id: Number(req.params.id) }, data });
    res.json({ message: 'Page updated.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Page not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.page.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Page deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Page not found.' });
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

module.exports = { getAll, getById, create, update, remove };
