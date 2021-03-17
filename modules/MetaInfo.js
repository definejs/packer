const File = require('@definejs/file');
const $Object = require('@definejs/object');

const IDRequires = require('./MetaInfo/IDRequires');




module.exports = {

    render(opt) {
        let { dir, id$info, name$pkg, name$id, name$requires, third$version, } = opt;
        
        let ids = Object.keys(id$info);

        let name$version = $Object.map(name$pkg, (name, pkg) => {
            return pkg.version; 
        });

        Object.assign(name$version, third$version);


        //最终要返回的元数据。
        let info = {
            id$info,
            ids,
            name$id,
            name$requires,
            name$version,
        };


        //生成元数据，用于以后查阅和参考。
        if (dir) {
            $Object.each(info, (key, value) => {
                File.writeSortJSON(`${dir}${key}.json`, value);
            });
        }
        
        return info;

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