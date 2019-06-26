if (typeof process !== undefined && typeof module !== undefined) {
  if (process.env.TESTENV === 'prod') {
    console.warn('== production build test 🚀 ==')
    // module.exports = require('../../builds/efrt');
    module.exports = require('../builds/compromise')
  } else {
    module.exports = require('../src')
  }
}
