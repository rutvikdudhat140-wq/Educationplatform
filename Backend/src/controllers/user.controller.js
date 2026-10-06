import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'user alredy exits' });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: name.trim(), email: email.toLowerCase(), password: hashedPassword,
      phone: phone ? String(phone).trim() : ''
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Mock sending email
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`Reset Password URL: ${resetUrl}`);

    res.status(200).json({
      message: 'Password reset link sent to email (check console)',
      resetUrl, // Send it back for testing purposes without actual email setup
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
