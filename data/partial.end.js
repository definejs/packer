
//重新定义多一份 module-manager 相关的模块，以给内部的其它包使用。
BaseMM.each(function (id) {
    InnerMM.define(id, function (require, module, exports) {
        return BaseMM.require(id);
    });
});

//导出的全局对象。
//以下代码由 `@definejs/packer` 工具处理生成。
global['{__global_exports_name__}'] = (function ({ require, bind, }) {
    let exports = { require, };

    //<!--global.exports.bind.begin-->
    exports['{name}'] = bind('{module}', '{method}');
    //<!--global.exports.bind.end-->

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
