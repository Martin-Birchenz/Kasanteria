const express = require('express');
const router = express.Router()
const CategoryController = require('../controllers/categoryController.js')

router.get('/', CategoryController.getCategory)
router.post('/', CategoryController.createCategory)

module.exports = router