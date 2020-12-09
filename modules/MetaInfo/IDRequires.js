const $Object = require('@definejs/object');



module.exports = {


    /**
    * 用 id 的视角去生成模块依赖关系的元数据。
    */
    get({ name$id, name$requires, thirds, }) { 
        let id$requires = {};

        $Object.each(name$requires, function (name, requires) {
            let id = name$id[name];

            let list = requires.map((name) => {
                let id = name$id[name] || thirds[name];

                if (id === true) { //如 'font-awesome' 的为 true，则直接用回原名。
                    id = name;
                }
                return id;
            });

            id$requires[id] = list;
        });

        return id$requires;

    },
};