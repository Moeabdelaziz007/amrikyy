const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'learning', 'finance', 'other'],
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  estimatedTime: {
    type: Number, // in minutes
    default: null
  },
  actualTime: {
    type: Number, // in minutes
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: String,
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'desktop'],
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  automation: {
    enabled: {
      type: Boolean,
      default: false
    },
    rules: [{
      trigger: {
        type: String,
        enum: ['due-date', 'status-change', 'time-spent'],
        required: true
      },
      action: {
        type: String,
        enum: ['send-reminder', 'change-priority', 'assign-user', 'create-subtask'],
        required: true
      },
      config: {
        type: mongoose.Schema.Types.Mixed
      }
    }]
  },
  collaboration: {
    sharedWith: [{
      userId: String,
      role: {
        type: String,
        enum: ['viewer', 'editor', 'admin'],
        default: 'viewer'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    createdBy: String,
    lastModifiedBy: String,
    version: {
      type: Number,
      default: 1
    },
    source: {
      type: String,
      enum: ['manual', 'import', 'api', 'automation'],
      default: 'manual'
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ 'collaboration.sharedWith.userId': 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual for completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  if (this.subtasks.length === 0) {
    return this.status === 'completed' ? 100 : 0;
  }
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Virtual for time efficiency
taskSchema.virtual('timeEfficiency').get(function() {
  if (!this.estimatedTime || this.actualTime === 0) return null;
  return Math.round((this.estimatedTime / this.actualTime) * 100);
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Pre-save middleware
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update completion date
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.status !== 'completed' && this.completedAt) {
    this.completedAt = null;
  }
  
  next();
});

// Instance methods
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({ title });
  return this.save();
};

taskSchema.methods.completeSubtask = function(subtaskId) {
  const subtask = this.subtasks.id(subtaskId);
  if (subtask) {
    subtask.completed = true;
    subtask.completedAt = new Date();
  }
  return this.save();
};

taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({ userId, content });
  return this.save();
};

taskSchema.methods.shareWithUser = function(userId, role = 'viewer') {
  const existingShare = this.collaboration.sharedWith.find(
    share => share.userId === userId
  );
  
  if (existingShare) {
    existingShare.role = role;
  } else {
    this.collaboration.sharedWith.push({ userId, role });
  }
  
  return this.save();
};

taskSchema.methods.removeUserAccess = function(userId) {
  this.collaboration.sharedWith = this.collaboration.sharedWith.filter(
    share => share.userId !== userId
  );
  return this.save();
};

// Static methods
taskSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId, isArchived: false };
  
  if (options.status) query.status = options.status;
  if (options.category) query.category = options.category;
  if (options.priority) query.priority = options.priority;
  
  return this.find(query).sort({ createdAt: -1 });
};

taskSchema.statics.findSharedWithUser = function(userId) {
  return this.find({
    'collaboration.sharedWith.userId': userId,
    isArchived: false
  }).sort({ updatedAt: -1 });
};

taskSchema.statics.findOverdue = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] },
    isArchived: false
  }).sort({ dueDate: 1 });
};

taskSchema.statics.getTaskStats = function(userId) {
  return this.aggregate([
    { $match: { userId, isArchived: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        totalTimeSpent: { $sum: '$actualTime' },
        avgTimeSpent: { $avg: '$actualTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Task', taskSchema);
