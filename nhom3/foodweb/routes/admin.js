const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/images')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

router.use(isAdmin);

router.get('/', adminController.dashboard);
router.get('/products', adminController.products);
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.get('/products/edit/:id', adminController.getEditProduct);
router.post('/products/edit/:id', upload.single('image'), adminController.postEditProduct);
router.post('/products/delete/:id', adminController.deleteProduct);
router.get('/orders', adminController.orders);
router.post('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
