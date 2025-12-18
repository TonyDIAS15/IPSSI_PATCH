const commentService = require('../services/comment.service');

exports.addComment = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  try {
    await commentService.addComment(content);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await commentService.getComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
