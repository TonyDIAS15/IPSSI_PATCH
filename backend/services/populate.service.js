const axios = require('axios');
const User = require('../models/User');

exports.populateUsers = async () => {
  const urls = [1, 2, 3].map(() => axios.get('https://randomuser.me/api/'));
  const results = await Promise.all(urls);

  for (const r of results) {
    const u = r.data.results[0];
    await User.create({
      name: `${u.name.first} ${u.name.last}`,
      password: u.login.password
    });
  }
};
