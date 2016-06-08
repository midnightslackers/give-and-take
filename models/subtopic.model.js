const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subTopicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const subTopicModel = mongoose.model('SubTopic', subTopicSchema);

module.exports = subTopicModel;
