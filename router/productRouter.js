const router = require('express').Router();
const productController = require('../controller/productController');
const authController = require('../controller/authController');

router.get('/get-all/?search=product', productController.getAllProduct);
router.get('/get-all/:min/:max/:sort', productController.priceFiler);
router.get('/get-one/:slug/:filter', productController.getOne);
// router.get('/get-all/?search=product', productController.getSearchedItem);

router.post('/add-product', productController.addProduct);
router.patch('/update-product', authController.protect, productController.updateProduct);

module.exports = router;