const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  demoUrl: { type: String },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Project', projectSchema);