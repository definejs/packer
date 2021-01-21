
//重新定义多一份 `module-manager` 相关的模块，以给内部的其它包使用。
BaseMM.each(function (id) {
    InnerMM.define(id, function (require, module, exports) {
        return BaseMM.require(id);
    });
});



//导出的全局对象。
//以下代码由 `@definejs/packer` 工具处理填充生成。
global['{__GlobalExports_name__}'] = (function ({ require, bind, }) {
    let exports = {
        require,
        /**
        * 加载 definejs 内部的公共模块，并创建它的一个实例。
        * @param {string} id 模块的名称(id)。
        * @return {Object} 返回该模块所创建的实例。
        */
        create(id, ...args) {
            let M = require(id);
            return new M(...args);
        },
    };

    let packages = exports['packages'] = {
        //<!--GlobalExports.packages.begin-->
        //这里会插入生成的代码。
        //<!--GlobalExports.packages.end-->
    };

    exports['modules'] = Object.values(packages).sort();

    //<!--GlobalExports.bind.begin-->
    exports['{name}'] = bind('{module}', '{method}');
    //<!--GlobalExports.bind.end-->


    //<!--GlobalExports.allowRequirePackage.begin-->
    //直接给业务层增加 `@definejs/` 域内的对应的包。
    //假设对外暴露的全局名为 definejs，传统的想要加载 Emitter 模块，则要使用方式：
    // const Emitter = definejs.require('Emitter');
    //下面的代码可以实现为使用方式：
    // const Emitter = require('@definejs/emitter');
    //两种使用方式都可以，是等价的。
    const AppModule = require('AppModule');
    const scope = `@definejs/`;
    let mm = AppModule.mm();
    let mm_require = mm.require.bind(mm);

    mm.require = function (id, ...args) {
        if (!id.startsWith(scope)) {
            return mm_require(id, ...args);
        }

        let mid = packages[id];

        if (!mid) {
            throw new Error(`{__GlobalExports_name__} 中不存在 '${id}' 对应的主模块。`);
        }

        return require(mid);
    };
    //<!--GlobalExports.allowRequirePackage.end-->


    return exports;

})(InnerMM);


}) (
    window,  // 在浏览器环境中。

    top,
    parent,
    window,
    document,
    location,
    navigator,
    localStorage,
    sessionStorage,
    console,
    history,
    setTimeout,
    setInterval,

    Array,
    Boolean,
    Date,
    Error,
    Function,
    JSON,
    Map,
    Math,
    Number,
    Object,
    RegExp,
    String,

    undefined
);
