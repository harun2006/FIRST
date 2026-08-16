require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createMasterAdmin() {
  try {
    // Connect to your database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Check if the admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create the user
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'Admin'
    });

    await adminUser.save();
    console.log('🎉 Master Admin created successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createMasterAdmin();