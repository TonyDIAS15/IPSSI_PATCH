const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const userController = require('./controllers/user.controller');
const commentController = require('./controllers/comment.controller');
const populateController = require('./controllers/populate.controller');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/users', userController.getUsers);
app.get('/populate', populateController.populate);
app.post('/comment', commentController.addComment);
app.get('/comments', commentController.getComments);

const sequelize = require('./models');

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (err) {
    console.error('DB sync error:', err);
  }
})();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
