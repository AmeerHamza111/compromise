var fs = require('fs')
var path = require('path')
var nlpPlugin = require('compromise-plugin')
var fileSize = require('./lib/filesize')

console.log('\n 🕑 packing lexicon..')
var out = path.join(__dirname, '../src/world/_data.js')

//pack it into one string
var data = require('../data')
var pckd = nlpPlugin.pack(data)

fs.writeFileSync(out, 'module.exports=`' + pckd + '`', 'utf8')

console.log('       - packed into -    ' + fileSize(out) + 'k\n')
console.log('  done!\n')
