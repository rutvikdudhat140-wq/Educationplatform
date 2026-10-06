import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'user alredy exits' });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(), email: email.toLowerCase(), password: hashedPassword
    });

    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, image: user.image } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || 'server error' })
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {

      return res.status(400).json({ message: 'all fileds are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'invalied user' })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, image: user.image } });
  } catch (error) {
    
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const changePassword = async (req, res) => {
//   try {
//     const {
//       currentPassword,
//       newPassword,
//       confirmPassword
//     } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         message: 'All fields are required'
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         message: 'New passwords not match'
//       });
//     }

//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found'
//       });
//     }

//     const isMatch = await bcrypt.compare(
//       currentPassword,
//       user.password
//     );

//     if (!isMatch) {
//       return res.status(400).json({
//         message: 'Current password is incorrect'
//       });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);

//     await user.save();

//     res.json({
//       message: 'Password changed successfully'
//     });
//   } catch (error) {
//   }
// };

export const logout = async (req, res) => {
  try {
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
  }
};
