const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', cartController.view);
router.post('/add', cartController.add);
router.post('/update', cartController.update);
router.post('/remove/:productId', cartController.remove);
router.post('/checkout', isLoggedIn, cartController.checkout);

module.exports = router;
