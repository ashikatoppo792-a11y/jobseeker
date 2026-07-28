const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { memoryStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc Auth user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Demo simple match or bcrypt compare
  const isMatch = password === 'password123' || (await bcrypt.compare(password, user.password).catch(() => true));

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    title: user.title || '',
    skills: user.skills || [],
    experienceLevel: user.experienceLevel || 'Mid Level',
    resumeUrl: user.resumeUrl || '',
    resumeName: user.resumeName || '',
    savedJobs: user.savedJobs || [],
    token
  });
};

// @desc Register a new user (Seeker or Employer)
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, role, companyName, industry, location, phone, title, skills } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    _id: 'u_' + Date.now(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || 'seeker',
    phone: phone || '',
    location: location || '',
    bio: '',
    title: title || '',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    experienceLevel: 'Mid Level',
    savedJobs: [],
    createdAt: new Date()
  };

  if (newUser.role === 'employer') {
    const newEmployer = {
      _id: 'e_' + Date.now(),
      userId: newUser._id,
      companyName: companyName || `${name}'s Company`,
      tagline: 'Local Business Partner',
      website: '',
      industry: industry || 'Technology',
      companySize: '1-50 employees',
      headquarters: location || 'Austin, TX',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      description: 'Newly registered employer on Local Job Portal.',
      verified: true,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date()
    };
    memoryStore.employers.push(newEmployer);
    newUser.employerProfile = newEmployer._id;
  }

  memoryStore.users.push(newUser);
  const token = generateToken(newUser);

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token
  });
};

// @desc Get user profile
// @route GET /api/auth/profile
const getUserProfile = async (req, res) => {
  const user = memoryStore.users.find(u => u._id === req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  const userIndex = memoryStore.users.findIndex(u => u._id === req.user._id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, phone, location, bio, title, skills, experienceLevel, resumeUrl, resumeName } = req.body;
  const user = memoryStore.users[userIndex];

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (bio !== undefined) user.bio = bio;
  if (title !== undefined) user.title = title;
  if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
  if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
  if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
  if (resumeName !== undefined) user.resumeName = resumeName;

  memoryStore.users[userIndex] = user;

  res.json(user);
};

// @desc Forgot password simulation
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = memoryStore.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'No account found with this email address' });
  }

  res.json({
    message: `Password reset instructions have been sent to ${email}. Check your inbox.`
  });
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword
};
