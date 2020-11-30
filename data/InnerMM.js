//此模块管理器用于 `@definejs/` 域内的所有模块的包装定义。
//立即执行函数里的参数 require 用于加载 `module-manager` 包中
//对应的主模块 ModuleManager，然后用它去创建和管理模块。
const InnerMM = (function ({ require, }) {
    let mm = null;

    function create() {
        if (mm) {
            return mm;
        }

        const ModuleManager = require('ModuleManager');

        //内部使用的模块管理器。
        mm = new ModuleManager({
            cross: true,       //内部的，要允许跨级加载模块。 用于在一步到位加载某个模块的默念配置，如 `SSH/Server.defaults`
        });

        return mm;
    }


    return {
        //在 Defaults.js 中用到。
        create,

        has: function (...args) {
            let mm = create();
            return mm.has(...args);
        },

        define: function (...args) {
            let mm = create();
            return mm.define(...args);
        },

        //在 `partial/end.js` 中用到。
        require: function (...args) {
            let mm = create();
            return mm.require(...args);
        },

        /**
        * 绑定到指定模块的指定方法。
        * @param {string} id 模块的 id。
        * @param {string} name 要绑定的模块方法的名称。
        * @param {Object|boolean} context 绑定的方法执行时的上下文，即 this 变量的指向。
        *   如果传入 true，则表示当前要绑定的模块本身。
        * @return {function} 返回绑定后的方法。
        */
        bind: function (id, name, context) {
            return function (...args) {
                let mm = create();
                var M = mm.require(id);
                var fn = M[name];

                if (typeof fn != 'function') {
                    throw new Error(`要绑定的模块 ${id} 中不存在名为 ${name} 的方法或函数。`);
                }

                context = context === true ? M : context || null;

                return fn.call(context, ...args);
            };
        },

    };

})(BaseMM);

//马上暴露给内部使用。
const define = InnerMM.define;


