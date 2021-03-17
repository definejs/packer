
const parse = require('./parse');
const install = require('./install');
const render = require('./render');


/**
* 使用指定的配置对象进行打包。
* @param {Object} config 必选，配置对象。
* @param {function} done 可选，回调函数。
*/
function pack(config, done) {
    //这些是必备的，直接写死。
    config.scope = '@definejs/';                //域名。
    config.moduleManager = 'module-manager';    //模块管理器对应的包名。

    let { tempDir, } = config;
    let dependencies = parse(config);

    let doRender = () => {
        let metaInfo = render(config, dependencies);
        done && done(config, metaInfo); //执行回调。
    };

    //指定要通过 npm 安装。
    if (config.install) {
        install(tempDir, dependencies, doRender);
    }
    else {
        doRender();
    }

};


module.exports = pack;




