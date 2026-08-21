import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.VITE_MONGODB_URI);
    
    // Delete existing admin
    await User.deleteMany({ email: 'admin@shiptrack.com' });
    console.log('Old admin user deleted');
    
    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('SecureCMS2026#', salt);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@shiptrack.com',
      password: hashedPassword
    });
    
    await admin.save();
    console.log('✅ New admin user created!');
    console.log('Email: admin@shiptrack.com');
    console.log('Password: SecureCMS2026#');
    process.exit();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();