const { sequelize } = require('./config/db');
const User = require('./models/userModel');
const Employee = require('./models/employeeModel');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop and recreate the tables

    // Create an initial admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    // Create some initial employees
    await Employee.bulkCreate([
      { name: 'John Doe', position: 'Software Engineer', department: 'Engineering' },
      { name: 'Jane Smith', position: 'Product Manager', department: 'Product' },
      { name: 'Sara Johnson', position: 'Designer', department: 'Design' },
    ]);
    
    console.log('Database has been initialized and populated with initial data.');
  } catch (error) {
    console.error('Initialization failed:', error);
  } finally {
    process.exit();
  }
};

initializeDatabase();
