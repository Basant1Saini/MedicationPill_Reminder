import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  generateToken(res, user._id);
  res.json({ _id: user._id, name: user.name, email: user.email });
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
};

export const getMe = (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ _id, name, email });
};
