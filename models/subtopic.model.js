const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subTopicSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  }
});

const subTopicModel = mongoose.model('SubTopic', subTopicSchema);

module.exports = subTopicModel;
