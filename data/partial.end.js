
//重新定义多一份 module-manager 相关的模块，以给内部的其它包使用。
BaseMM.each(function (id) {
    InnerMM.define(id, function (require, module, exports) {
        return BaseMM.require(id);
    });
});

//导出的全局对象。
//以下代码由 `@definejs/packer` 工具处理生成。
global['{__global_exports_name__}'] = (function ({ require, bind, }) {
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

    //<!--global.exports.bind.begin-->
    exports['{name}'] = bind('{module}', '{method}');
    //<!--global.exports.bind.end-->

    exports['modules'] = [
        //<!--global.exports.modules.begin-->
        //这里会插入生成的代码。
        //<!--global.exports.modules.end-->
    ];

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
