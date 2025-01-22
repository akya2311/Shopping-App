const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize'); // Import Sequelize operators
const Product = require('../models/productModel'); // Adjust the path to your model as necessary

// @desc Get all products
// @route GET /api/products
// @access Private/Admin
const getProducts = asyncHandler(async (req, res) => {
  const { sort_by, category, title_search, rating } = req.query;

  // Build dynamic query conditions
  const conditions = {};

  if (category) {
    conditions.category = { [Op.like]: `%${category}%` }; // Assuming category is a string and filtering with a 'LIKE' operator for flexibility
  }

  if (title_search) {
    conditions.title = { [Op.like]: `%${title_search}%` }; // For partial title matches
  }

  if (rating) {
    conditions.rating = { [Op.gte]: parseInt(rating) }; // Ensure we filter products with rating greater than or equal to provided value
  }

  // Build sort condition based on the query parameter
  let sortCondition = [];
  if (sort_by) {
    switch (sort_by) {
      case 'PRICE_HIGH':
        sortCondition = [['price', 'DESC']];
        break;
      case 'PRICE_LOW':
        sortCondition = [['price', 'ASC']];
        break;
      case 'TITLE_ASC':
        sortCondition = [['title', 'ASC']];
        break;
      case 'TITLE_DESC':
        sortCondition = [['title', 'DESC']];
        break;
      case 'RATING_DESC':
        sortCondition = [['rating', 'DESC']]; // Sort by rating descending
        break;
      case 'RATING_ASC':
        sortCondition = [['rating', 'ASC']]; // Sort by rating ascending
        break;
      default:
        break;
    }
  }

  try {
    // Fetch all products with conditions and sorting (no pagination)
    const products = await Product.findAll({
      where: conditions, // Apply dynamic conditions
      order: sortCondition, // Apply dynamic sorting
    });

    // Send the response with the product data
    res.status(200).json({
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        image_url: product.image_url,
        rating: product.rating,
        category: product.category, // Added category
        description: product.description, // Added description
      })),
    });
  } catch (error) {
    // Catch any errors and return a response with the error message
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// @desc Get product by ID
// @route GET /api/products/:id
// @access Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract product ID from route parameters

  try {
    // Find product by ID in the database
    const product = await Product.findByPk(id); // Use findByPk for Sequelize

    // If no product is found, return a 404 response
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send the product details as a response
    return res.status(200).json(product);
  } catch (error) {
    // Handle errors (e.g., invalid ID format or database issues)
    console.error('Error fetching product by ID:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// @desc Create new product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { title, brand, price, image_url, rating, description, category } = req.body;

  // Validate the required fields
  if (!title || !brand || !price || !image_url || !rating || !description || !category) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  if (isNaN(price) || price <= 0) {
    res.status(400).json({ message: 'Invalid price value' });
    return;
  }

  if (isNaN(rating) || rating < 0 || rating > 5) {
    res.status(400).json({ message: 'Rating must be between 0 and 5' });
    return;
  }

  try {
    // Create the product in the database
    const product = await Product.create({
      title,
      brand,
      price,
      image_url,
      rating,
      description,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    // Only update fields that are provided in the request body
    product.title = req.body.title || product.title;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.image_url = req.body.image_url || product.image_url;
    product.rating = req.body.rating || product.rating;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;

    // Validate price and rating
    if (product.price && (isNaN(product.price) || product.price <= 0)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    if (product.rating && (isNaN(product.rating) || product.rating < 0 || product.rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    await product.destroy();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
