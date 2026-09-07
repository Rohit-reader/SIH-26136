const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientRole: { type: String, required: true },
  recipientName: { type: String, default: '' },
  recipientEmail: { type: String, default: '' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Challenge', 'Challenge Invitation', 'Proposal', 'Evaluation', 'Milestone', 'Pilot', 'ScaleUp', 'System'], 
    default: 'System' 
  },
  link: { type: String, default: '' },
  entityId: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
