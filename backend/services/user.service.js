const User = require('../models/User');

exports.getUsers = async () => {
  return await User.findAll({
    attributes: ['id']
  });
};
