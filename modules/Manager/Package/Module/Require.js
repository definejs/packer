
const $Object = require('@definejs/object');

module.exports = {

    /**
    * 
    * @param {Object} opt 
    *   opt = {
    *      name: '',      //当前模块的短名称，如 `Alert/Dialog` 则为 `Dialog`。
    *      name$id: '',   //包名称对应的主模块 id，如 { '@definejs/alert': 'Alert', }。
    *
    *    };
    */
    getFixPatterns(opt) {
        let name = opt.name;
        let name$id = opt.name$id || {};

        let patterns = [
            //针对子模块的单引号。 
            //如` require('./Alert/Dialog')` => ` module.require('Dialog')`。
            {
                s0: ` require('./${name}/`,
                s1: ` module.require('`,
            },

            //平级模块。 
            //一般是 { name }.defaults 模块。 
            //如` require("./Alert.defaults")` => ` require("Alert.defaults")`。
            {
                s0: ` require('./`,
                s1: ` require('`,
            },
        ];

        //针对全局的引用。
        //构造针对类似 `require('@definejs/object')` 的替换规则，替换成 `require('Object')`
        $Object.each(name$id, (name, id) => {
            let list = [
                //单引号。
                {
                    s0: ` require('${name}');`,
                    s1: ` require('${id}');`,
                },
            ];

            patterns = patterns.concat(list);

        });

        return patterns;
    },
};