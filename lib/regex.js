const regex = {};

regex.new = (pattern, modifiers = 'i') => {
  return new RegExp(pattern, modifiers);
};

module.exports = regex;
