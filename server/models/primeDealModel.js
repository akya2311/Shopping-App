const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PrimeDeal = sequelize.define(
  'PrimeDeal',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'PrimeDeal', // Specify table name
    timestamps: false, // Disable timestamps if not required
  }
);

module.exports = PrimeDeal;
