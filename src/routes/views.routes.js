import { Router } from 'express';
import Product from '../models/Products.js';

const router = Router();

// ruta principal home
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Página Principal',
        welcomeMessage: '¡Bienvenido a la tienda en línea!',
    });
});

// Ruta para mostrar productos con paginación y filtros
router.get('/realtimeproducts', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;

        // Filtros query
        const filter = query ? { name: { $regex: query, $options: 'i' } } : {};

        // opciones de paginacion y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}, // Ordenar por precio
        };

        // Obtener productos con paginacion
        const products = await Product.paginate(filter, options);

        // renderizar la vista con los productos
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            totalPages: products.totalPages,
            currentPage: products.page,
            limit: products.limit,
            sort,
            query,
        });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al obtener los productos',
            error,
        });
    }
});

export default router;
