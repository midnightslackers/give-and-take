const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: []
  },
  subs: []
  
});

const topicModel = mongoose.model('Topic', topicSchema);

module.exports = topicModel;
