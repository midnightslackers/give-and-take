const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subTopics: [{
    type: Schema.Types.ObjectId,
    ref: 'SubTopic'
  }]
});

const topicModel = mongoose.model('Topic', topicSchema);

module.exports = topicModel;
