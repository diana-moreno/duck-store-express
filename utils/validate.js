const { ContentError } = require('./errors')

const validate = {
  typeOf(type, target) {
    if (typeof target !== type) throw new TypeError(`${target} is not a ${type}`)
  },

  string(target) {
    this.typeOf('string', target)
  },

  function(target) {
    this.typeOf('function', target)
  },

  number(target) {
    this.typeOf('number', target)
  },

  boolean(target) {
    this.typeOf('boolean', target)
  },

  instanceOf(type, target) {
    if (!(target instanceof type)) throw TypeError(`${target} is not a ${type.name}`)
  },

  array(target) {
    this.instanceOf(Array, target)
  }
}

validate.string.notVoid = function(name, target) {
  if (!target.trim().length) throw new ContentError(`${name} is empty or blank`)
}

module.exports = validate
