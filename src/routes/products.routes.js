import { Router } from 'express';
import Product from '../models/Products.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    // filtro dinámico
    const filter = query ? { $or: [{ category: query }, { available: query }] } : {};

    // ordenamiento
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    // consulta paginada
    const products = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
    });

    // construir respuesta
    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.page - 1 : null,
      nextPage: products.hasNextPage ? products.page + 1 : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${products.page - 1}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${products.page + 1}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', error: 'Error al obtener los productos.' });
  }
});

export default router;