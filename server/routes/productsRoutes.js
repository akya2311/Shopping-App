const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController'); // Import all necessary controllers
const { protect, admin } = require('../middlewares/authMiddleware'); // Import middlewares

const router = express.Router();

// Routes for product operations
router
  .route('/')
  .get(protect, getProducts) // Fetch all products (protected route)
  .post(protect, admin, createProduct); // Create a new product (admin only)

router
  .route('/:id')
  .get(protect, getProductById) // Fetch a single product by ID (protected route)
  .put(protect, admin, updateProduct) // Update a product by ID (admin only)
  .delete(protect, admin, deleteProduct); // Delete a product by ID (admin only)

module.exports = router;
