const regex = module.exports;

regex.new = (pattern, modifiers = 'i') => {
  return new RegExp(pattern, modifiers);
};
