const express = require('express');
const {
  getPrimeDeals,
  createPrimeDeal,
  updatePrimeDeal,
  deletePrimeDeal,
} = require('../controllers/primeDealController');  // Update this path as per your controller
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for fetching all prime deals and creating a prime deal
router.route('/')
  .get(protect, getPrimeDeals)  // Protect the route for fetching prime deals
  .post(protect, admin, createPrimeDeal);  // Protect and require admin to create prime deals

// Route for updating and deleting a prime deal by ID
router.route('/:id')
  .put(protect, admin, updatePrimeDeal)  // Admin protected route for updating a prime deal
  .delete(protect, admin, deletePrimeDeal);  // Admin protected route for deleting a prime deal

module.exports = router;
