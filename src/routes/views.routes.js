import { Router } from 'express';

const router = Router();

// ruta home
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// ruta de real-time products
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en tiempo real' });
});

export default router;