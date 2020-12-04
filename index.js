

require('colors');

const parse = require('./parse');
const install = require('./install');
const pack = require('./pack');


module.exports = {
    'parse': parse,
    'install': install,
    'pack': pack,   //主方法。
};


