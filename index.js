

require('colors');

const parse = require('./parse');
const install = require('./install');
const pack = require('./pack');

const type$config = {
    'default': require('./config/default'),
    'mobile': require('./config/mobile'),
    'pc': require('./config/pc'),
};



module.exports = {
    'configs': type$config,
    'parse': parse,
    'install': install,
    'pack': pack,   //主方法。
};


