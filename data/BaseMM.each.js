
//重新定义多一份 `module-manager` 相关的模块，以给内部的其它包使用。
BaseMM.each(function (id) {
    InnerMM.define(id, function (require, module, exports) {
        return BaseMM.require(id);
    });
});


