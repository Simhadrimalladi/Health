const { User } = require('../models');
const ApiError = require('../utils/ApiError');
exports.listUsers = async (req, res) => res.json({ data: await User.find().sort({ name: 1 }).lean() });
exports.getUser = async (req, res) => {
  const user = await User.findOne({ id: req.params.id }).lean();
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ data: user });
};
