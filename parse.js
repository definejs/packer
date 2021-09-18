const $Object = require('@definejs/object');
const File = require('@definejs/file');


function parse (config) {
    let { scope, moduleManager, tempDir, packages, } = config;
    let dependencies = null;


    if (Array.isArray(packages)) {
        dependencies = {};

        //标准化，加上域名 `@definejs/` 作为前缀。
        packages.forEach((name, index) => {
            if (!name.startsWith(scope)) {
                name = scope + name;
            }

            dependencies[name] = '';
        });

    }
    else if ($Object.isPlain(packages)) {
        dependencies = packages;
    }
    else {
        let pkg =
            packages === true ? `${tempDir}package.json` : 
            typeof packages == 'string' ? packages : null;

        if (pkg) {
            pkg = File.readJSON(pkg);
            dependencies = pkg.dependencies || {};
        }
    }

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