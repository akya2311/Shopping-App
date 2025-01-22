const asyncHandler = require('express-async-handler');
const PrimeDeal = require('../models/primeDealModel'); // Adjust the path to your model

// @desc Get all prime deals
// @route GET /api/prime-deals
// @access Private/Admin
const getPrimeDeals = asyncHandler(async (req, res) => {
  try {
    const primeDeals = await PrimeDeal.findAll();
    res.status(200).json(primeDeals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prime deals', error: error.message });
  }
});

// @desc Create new prime deal
// @route POST /api/prime-deals
// @access Private/Admin
const createPrimeDeal = asyncHandler(async (req, res) => {
  const {
    id,
    image_url,
    title,
    style,
    price,
    description,
    brand,
    total_reviews,
    rating,
    availability,
  } = req.body;

  if (!id || !image_url || !title || !price) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const newDeal = await PrimeDeal.create({
      id,
      image_url,
      title,
      style,
      price,
      description,
      brand,
      total_reviews,
      rating,
      availability,
    });
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create prime deal', error: error.message });
  }
});

// @desc Update a prime deal
// @route PUT /api/prime-deals/:id
// @access Private/Admin
const updatePrimeDeal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const primeDeal = await PrimeDeal.findByPk(id);

    if (!primeDeal) {
      return res.status(404).json({ message: 'Prime deal not found' });
    }

    const updatedData = {
      ...primeDeal.dataValues,
      ...req.body, // Merge the new data with the existing data
    };

    await primeDeal.update(updatedData);
    res.status(200).json(primeDeal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update prime deal', error: error.message });
  }
});

// @desc Delete a prime deal
// @route DELETE /api/prime-deals/:id
// @access Private/Admin
const deletePrimeDeal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const primeDeal = await PrimeDeal.findByPk(id);

    if (!primeDeal) {
      return res.status(404).json({ message: 'Prime deal not found' });
    }

    await primeDeal.destroy();
    res.status(200).json({ message: 'Prime deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prime deal', error: error.message });
  }
});

module.exports = { getPrimeDeals, createPrimeDeal, updatePrimeDeal, deletePrimeDeal };
