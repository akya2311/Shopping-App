const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { 
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Product title or name',
  },
  brand: { 
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Brand of the product',
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price of the product in decimal format',
  },
  image_url: { 
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL for the product image',
  },
  rating: { 
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
    comment: 'Customer rating for the product (0 to 5)',
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the product',
  },
  category: { 
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Category of the product (e.g., Appliances, Toys, Grocery)',
  },
}, {
  tableName: 'products',
  timestamps: true, // Adds createdAt and updatedAt fields
  comment: 'Table for storing product details',
});

module.exports = Product;
