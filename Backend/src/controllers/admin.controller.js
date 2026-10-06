import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    return res.status(400).json({
      message: 'Admin already exists',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: passwordHash,
  });

  const token = jwt.sign(
    {
      id: admin._id,
      role: 'admin',
    },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.status(201).json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).json({
      message: 'Invalid credentials',
    });
  }

  const passwordMatch = await bcrypt.compare(
    password,
    admin.password
  );

  if (!passwordMatch) {
    return res.status(400).json({
      message: 'Invalid credentials',
    });
  }

  const token = jwt.sign(
    {
      id: admin._id,
      role: 'admin',
    },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
};

export const getProfile = async (req, res) => {
  const admin = await Admin.findById(req.user.id).select('-password');

  if (!admin) {
    return res.status(404).json({
      message: 'Admin not found',
    });
  }

  res.json(admin);
};
