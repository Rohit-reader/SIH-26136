const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true },
  actorRole: { type: String, required: true },
  actorName: { type: String, required: true },
  details: { type: String, required: true },
  entityId: { type: String }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
