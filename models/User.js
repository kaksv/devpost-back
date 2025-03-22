const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Compare a given password to the user's hashed password.
   *
   * @param {string} candidatePassword - The password to compare to the user's password.
   * @returns {Promise<boolean>} - true if the password matches, false otherwise
   */
/******  ddd78ae2-aaec-4ea4-afaf-9ab585e4b632  *******/userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);