const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientRole: { type: String, required: true },
  recipientEmail: { type: String, default: '' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Challenge', 'Proposal', 'Evaluation', 'Milestone', 'Pilot', 'ScaleUp', 'System'], 
    default: 'System' 
  },
  entityId: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
