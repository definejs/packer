
const IDRequires = require('./MetaInfo/IDRequires');

const File = require('@definejs/file');



module.exports = {

    render(opt) {
        let { dir, } = opt;

        //生成元数据，用于以后查阅和参考。
        ['id$info', 'name$id', 'name$requires',].forEach((key) => {
            File.writeSortJSON(`${dir}${key}.json`, opt[key]);
        });

        let ids = Object.keys(opt.id$info);
        File.writeSortJSON(`${dir}ids.json`, ids);

        //以下代码分析出来的依赖关系，仅仅是从包的粒度，太粗了。
        //需要从模板粒度进行分析，TODO...
        
        // let id$requires = IDRequires.get(opt);
        // File.writeSortJSON(`${dir}id$requires.json`, id$requires);


        // let id$dependents = {};

        // Object.keys(id$requires).forEach((id) => {
        //     let requires = id$requires[id];

        //     requires.forEach((sid) => { 
        //         let dependents = id$dependents[sid] || [];
        //         dependents.push(id);
        //         id$dependents[sid] = [...new Set(dependents)];

        //     });
        // });

        // File.writeSortJSON(`${dir}id$dependents.json`, id$dependents);




    },
};