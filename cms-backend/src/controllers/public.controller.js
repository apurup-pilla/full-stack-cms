const prisma = require('../config/db');

async function getPublishedPages(req, res) {
  const { category, search, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { status: 'published' };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  try {
    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        select: {
          id: true, title: true, slug: true, status: true, content: true,
          createdAt: true, updatedAt: true,
          author: { select: { name: true } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.page.count({ where }),
    ]);

    res.json({
      pages,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function getPageBySlug(req, res) {
  try {
    const page = await prisma.page.findFirst({
      where: { slug: req.params.slug, status: 'published' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
    });
    if (!page) return res.status(404).json({ message: 'Page not found.' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

async function getPublicCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      where: { pages: { some: { status: 'published' } } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
}

module.exports = { getPublishedPages, getPageBySlug, getPublicCategories };
