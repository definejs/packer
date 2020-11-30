#!/usr/bin/env node
console.log('hello definejs-packer');

const pkg = require('../package.json');
const { program, } = require('commander');

program.storeOptionsAsProperties(false);


program.version(pkg.version, '-v, --version');
program.option('-i, --install', 'install packages from npm.');
program.option('--no-install', 'do not install packages from npm.');
program.option('-p, --packages <names...>', 'set seed package names without prefix `@definejs/`.');
program.option('-n, --global-name <name>', 'set global exports name.')
program.option('-b, --global-bind <binds...>', 'bind module method to global exports.');
program.option('-t, --temp-dir <dir>', 'set temporary directory to download packages from npm.');
program.option('-o, --output-dir <dir>', 'set output directory to build packages to modules.');
program.option('-c, --copy-dir <dir>', 'copy builded modules to test directory.');



//解析命令行参数。
program.parse();

let opts = program.opts();


console.log(opts);