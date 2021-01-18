

const $String = require('@definejs/string');
const $Object = require('@definejs/object');
const File = require('@definejs/file');

const GlobalExports = require('./Manager/GlobalExports');
const HeadComments = require('./Manager/HeadComments');
const Package = require('./Manager/Package');
const Sample = require('./Manager/Sample');


const name$pkg = {};        //包名对应的 Package 实例。
const name$id = {};         //包名对应的主模块 id。
const id$name = {};         //主模块 id 对应的包名。 主要用于检查包名与主模块 id 是否为一一对应的关系。
const name$requires = {};   //包名对应的需要依赖的其它包名，包括需要依赖的第三方包名。
const third$version = {};   //第三方包名对应的版本号。
const id$info = {};         //模块 id 对应的模块信息。



module.exports = exports = {
    name$pkg,
    name$id,
    id$name,
    name$requires,
    third$version,
    id$info,


    /**
    * 解析传入的包名列表，并且会递归解析所有依赖的包。
    * @param {Array} names 要解析的包名列表，仅限于 `@definejs/` 域名下的，如 ['@definejs/dialog', '@definejs/api',]。
    * @param {Object} opt 必选配置。
    *   opt = {
    *       dir: '',    //包所在的目录，如 `./temp/node_modules/`。
    *       scope: '',  //域名，只能是 `@definejs/`。
    *   };
    */
    parse(names, opt) { 
        
        names.forEach((name) => {
            let pkg = name$pkg[name];

            //已解析过了。
            if (pkg) {
                return;
            }

            pkg = name$pkg[name] = new Package(name, opt);


            let dependencies = pkg.parse(); //先进行解析。
            let id = pkg.getMainModuleId(); //获取对应的主模块 id。
            let sid = name$id[name];
            let sname = id$name[id];

            //检查一个包名是否对应多个不同的主模块 id。
            if (sid && sid != id) {
                console.log(`包`, name.green, `已存在对应的主模块`, sid.red,
                    `，新的主模块为`, id.red, `。 要求包与主模块为一对一关系。`);
                throw new Error();
            }

            //检查一个主模块 id 是否对应多个不同的包名。
            if (sname && sname != name) {
                console.log(`主模块`, id.green, `已存在对应的包`, sname.red,
                    `，新的包为`, name.red, `。 要求包与主模块为一对一关系。`);
                throw new Error();
            }

            name$id[name] = id;
            id$name[id] = name;


            let names = [];

            $Object.each(dependencies, (name, version) => {
                if (name.startsWith(opt.scope)) { //内部 `@definejs/` 中的依赖。
                    names.push(name);
                }
                else {  //第三方依赖。  
                    third$version[name] = version;
                }
            });
            name$requires[name] = Object.keys(dependencies);

            exports.parse(names, opt); //递归。

        });

    },


    /**
    * 渲染生成 js 模块。
    * @param {Object} opt 必选配置。
    *   opt = {
    *       dest: '',       //输出的目标文件路径模板，如 `./output/{name}/{id}.js`。
    *       name$sample: {  //包名对应的用于生成 js 模块的模板文件。
    *           '*': './data/define.sample.js',
    *           '@definejs/module-manager: './data/$define.sample.js',
    *       },
    *   };
    */
    render({ dest, name$sample, }) {

        $Object.each(name$pkg, (name, pkg) => { 
            let sample = Sample.get(name, name$sample);

            let id$item = pkg.render({
                'dest': dest,           // dest = './output/{name}/{id}.js';
                'name$id': name$id,
                'sample': sample,
            });

            //这里逐个检查一下。
            $Object.each(id$item, (id, item) => { 
                let info = id$info[id];

                if (info) {
                    throw new Error(`已存在 id 为 ${id} 的模块信息。`);
                }

                id$info[id] = item;
            });

        });

    },

    /**
    * 合并 js 文件，作替换或注入一些特定的内容。
    * @param {Object} opt 必先配置项。
    *   opt = {
    *       mmId: 'ModuleManager',
    *       begins: [],
    *       ends: [],
    *       dest: '',
    *   };
    */
    concat({ moduleManager, globalExports, begins, ends, dest, }) { 
        let bodys = [];

        begins = File.read(begins);

        
        $Object.each(id$info, (id, info) => {
            if (info.ext != '.js') {
                return;
            }

            //这几个模块是包管理器，也是基础，要放在前面。
            let isMM = info.package.alias == moduleManager;
            let list = isMM ? begins : bodys;

            list.push(info.content);

        });

        ends = File.read(ends);


        let content = [...begins, ...bodys, ...ends,].join('\r\n');

        content = HeadComments.render(content, { name$id, name$pkg, });
        content = GlobalExports.render(content, globalExports, name$id);

        
        if (dest) {
            File.write(dest, content);
        }

        return content;

    },

   

};