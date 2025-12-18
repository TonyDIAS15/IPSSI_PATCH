const populateService = require('../services/populate.service');

exports.populate = async (req, res) => {
  await populateService.populateUsers();
  res.send('Inserted 3 users into database.');
};
