const router = require('express').Router();
const viewController = require('../controller/viewController')

router.get('/', viewController.home);
router.get('/products/:slug', viewController.getOne)

router.get('/login', viewController.login)
router.get('/signup', viewController.signup)

module.exports = router;