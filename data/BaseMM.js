

//模块管理器用于定义 `module-manager` 包中的模块，提供最简单的模块定义和加载功能。
const BaseMM = (function () {
    const id$factory = {};
    const id$exports = {};

    function define(id, factory) {
        id$factory[id] = factory;
    }

    function require(id) { 
        let exports = id$exports[id];
        if (exports) {
            return exports;
        }

        let factory = id$factory[id];

        let module = {
            exports: {},
            //用于加载当前模块的直接子模块。
            require(name) {
                return require(`${id}/${name}`);
            },
        };


        exports = factory(require, module, module.exports);

        //没有通过 return 来返回值，则要导出的值只能在 module.exports 里。
        if (exports === undefined) {
            exports = module.exports;
        }

        id$exports[id] = exports;

        return exports;
    }

    return {
        define,
        require,
        //供 `patial.end.js` 使用，以便重新定义一份。
        each(fn) { 
            Object.keys(id$factory).forEach(fn);
        },
    };

})();

//马上暴露给内部使用。
const $define = BaseMM.define;