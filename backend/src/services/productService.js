import prisma from '../config/db.js';

export async function getPublicProducts({ page = 1, limit = 12, category = '', search = '', featured = false }) {
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(featured ? { isFeatured: true } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } }
          ]
        }
      : {})
  };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        price: true,
        stock: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { displayOrder: 'asc' },
          select: {
            id: true,
            imageUrl: true,
            isPrimary: true
          }
        }
      }
    })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getPublicProductById(idOrSlug) {
  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      OR: [{ id: idOrSlug }, { slug: idOrSlug }]
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { displayOrder: 'asc' } }
    }
  });

  if (!product) {
    const error = new Error('Product not found or inactive');
    error.statusCode = 404;
    error.errorCode = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  return product;
}

export async function getPublicCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true
    }
  });
}
