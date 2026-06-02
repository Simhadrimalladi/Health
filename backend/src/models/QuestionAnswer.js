const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  questionId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  answerText: { type: String, required: true },
  nodeId: { type: String, required: true, index: true },
  answeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

questionAnswerSchema.index({ questionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('QuestionAnswer', questionAnswerSchema);
