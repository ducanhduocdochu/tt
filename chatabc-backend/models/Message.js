const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },  
  value: { type: String, required: true },  
  isAi: { type: Boolean, required: true },  
  createdAt: { type: Date, default: Date.now }  
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
