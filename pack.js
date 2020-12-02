


const parse = require('./parse');
const install = require('./install');
const render = require('./render');


const type$config = {
    'default': require('./config/default'),
    'mobile': require('./config/mobile'),
    'pc': require('./config/pc'),
};


/**
* 使用指定的配置对象或内置的配置类型进行打包。
* 已重载 pack();        //相当于 pack('default'); 使用内置的默认类型进行打包。
* 已重载 pack(done);    //相当于 pack('default', done); 使用内置的默认类型进行打包，结束后执行传入的回调函数。
* 已重载 pack(type);    //使用内置的指定类型进行打包。
* 已重载 pack(type, done);      //使用内置的指定类型进行打包，结束后执行传入的回调函数。
* 已重载 pack(config);          //使用自定义的配置对象进行打包。
* 已重载 pack(config, done);    //使用自定义的配置对象进行打包，结束后执行传入的回调函数。
* @param {Object|string} config 配置对象或配置类型。
*   当使用配置类型时，只能为 `default` | `mobile` | `pc` 三者中的一个，使用内置的配置。
*   当使用配置对象时，请传入一个完整的配置对象，具体格式参考 `./config/default.js`。
*
*/
function pack(config, done) {
    //重载 pack(done);
    if (typeof config == 'function') {
        done = config;
        config = 'default';
    }
    //重载 pack(type);
    //使用指定类型的内置配置进行打包。
    else if (typeof config == 'string') {
        let type = config;
        config = type$config[type];
    }


    //这些是必备的，直接写死。
    config.scope = '@definejs/';                //域名。
    config.moduleManager = 'module-manager';    //模块管理器对应的包名。

    let { tempDir, } = config;
    let dependencies = parse(config);

    let doRender = () => {
        render(config, dependencies);
        done && done(); //执行回调。
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




