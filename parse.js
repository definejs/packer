
const File = require('@definejs/file');


function parse(config) {
    let { scope, moduleManager, tempDir, } = config;
    let pkg = File.readJSON(`${tempDir}package.json`);
    let dependencies = pkg.dependencies || {};

    //确保以域名 `@definejs/` 作为前缀。
    if (!moduleManager.startsWith(scope)) {
        moduleManager = scope + moduleManager;
    }

    //这个包是模块管理器，是必须的，要添加到种子包中。
    if (typeof dependencies[moduleManager] != 'string') {
        dependencies[moduleManager] = '';
    }

    return dependencies;
}

module.exports = parse;