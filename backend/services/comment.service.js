const Comment = require('../models/Comment');

exports.addComment = async (content) => {
  await Comment.create({ content });
};

exports.getComments = async () => {
  return await Comment.findAll({
    order: [['id', 'DESC']]
  });
};
