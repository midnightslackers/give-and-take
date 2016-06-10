const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const subTopicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  }
});

subTopicSchema.plugin(uniqueValidator);

const subTopicModel = mongoose.model('SubTopic', subTopicSchema);
module.exports = subTopicModel;
