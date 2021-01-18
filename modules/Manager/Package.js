
const path = require('path');
const $Object = require('@definejs/object');
const $String = require('@definejs/string');
const Fn = require('@definejs/fn');
const File = require('@definejs/file');
const Patterns = require('@definejs/patterns');

const Name = require('./Package/Name');
const Module = require('./Package/Module');
const Packer = require('./Package/Packer');

const mapper = new Map();



class Package { 

    /**
     * 
     * @param {*} pname 包的短名称或长名称。
     * @param {*} config 
     *  config = {
     *      scope: '',  //域名，只能是 `@definejs/`。
     *      dir: '',    //包所在的目录，如 `./temp/node_modules/`。
     *  };
     */
    constructor(pname, config) { 
        let { scope, dir, } = config;
        let { alias, name, } = Name.parse(pname, scope);

        dir = path.join(dir, name) + '/';   


        let meta = {
            'alias': alias,         //包的短名称，如 `dialog`。
            'name': name,           //包的完整名称，如 `@definejs/dialog`。
            'id': '',               //包的 id，如 `@definejs/dialog@1.0.0`。
            'version': '',          //版本号。
            'dir': dir,             //包所在的主目录，如 `temp/node_modules/@definejs/dialog/`。
            'pkg': {},              //包的 `package.json` 文件对应的 JSON 数据。

            'main': '',             //包的主文件。 如 `temp/node_modules/@definejs/dialog/index.js`。
            'modules': [],          //模块的信息列表。
            'file$id': {},          //直接指定的模块文件要映射的模块 id。
            'file$info': {},        //文件映射的模块信息。
            
        };

        mapper.set(this, meta);

        Object.assign(this, {
            'alias': meta.alias,
            'name': meta.name,
            'version': meta.version,
            'id': meta.id,
        });

    }

    /**
     * 
     */
    parse() {
        let meta = mapper.get(this);
        let pkg = File.readJSON(`${meta.dir}package.json`);
        let {file$id} = Packer.get(meta.dir);
       
        meta.file$id = file$id;


        //获取 `modules` 目录下的所有 js 文件。
        let files = Patterns.getFiles(`${meta.dir}modules/`, [
            '**/*.js',
            '**/*.less',    //这里只是搜索出来并复制。
        ]);

        //解析所对应的模块信息。
        files.forEach((file) => { 
            let info = Module.parse(file);

            meta.file$info[file] = Object.assign(info, {
                //所在的包信息。
                package: {
                    'alias': meta.alias,
                    'name': meta.name,
                    'version': pkg.version,
                },
            });

        });

        //针对 packer.js 中的特殊配置映射。
        $Object.each(file$id, (file, id) => { 
            let ext = path.extname(file).toLowerCase();         //后缀名，如 `.js`。
            let names = id.split('/');
            let name = names[names.length - 1]; //最后一项即为短名称。

            meta.file$info[file] = {
                id,     //模块 id，即模块的完整名称，如 `Alert/Dialog`。
                name,   //模块名称，即模块的短名称，如 `Dialog`。
                names,  //模块完整名称的各个层级名称，如 ['Alert', 'Dialog']。
                file,   //模块所对应的原文件。
                ext,    //模块所对应的原文件的后缀名，如 `.js`。
                //所在的包信息。
                package: {
                    'alias': meta.alias,
                    'name': meta.name,
                    'version': pkg.version,
                },
            };
        });
        
        meta.pkg = pkg;
        meta.id =  this.id = `${meta.name}@${pkg.version}`; //如`@definejs/dialog@1.0.0`。
        meta.version = this.version = pkg.version;
        meta.main = path.join(meta.dir, pkg.main);

        let dependencies = pkg.dependencies || {};

        return dependencies;

    }

    /**
     * 获取包中对应的主模块 id。
     * 一个包中只有一个主模块。
     */
    getMainModuleId() { 
        let meta = mapper.get(this);
        let id = meta.file$id[meta.main];

        if (id) {
            return id;
        }
            
        let content = File.read(meta.main);      //
       
        //构造一个执行环境，
        //从类似 `module.exports = require('./modules/Dialog');` 这样的语句行中，
        //把 require 里的参数拿出来得到 './modules/Dialog'。
        //通过重写 require 函数即可。
        let file = Fn.exec(`
            var require = file => file;
            var module = {}, exports = {};
            ${content}
            return module.exports;
        `);

        let ext = path.extname(file);

        if (!ext) {
            file = file + '.js';
        }

        file = path.join(meta.dir, file);
        id = meta.file$id[file];

        if (id) {
            return id;
        }

        let info = meta.file$info[file];

        if (!info) {
            throw new Error(`在 ${meta.name} 中，无法从 ${file} 文件中确定所对应的主模块 id。`);
        }

        return info.id;

    }

    /**
     * 
     * @param {*} opt = {
     *  
     * };
     */
    render(opt) { 
        let { dest, sample, name$id } = opt;
        let meta = mapper.get(this);
        let id$info = {};

        $Object.each(meta.file$info, (file, info) => { 
            let content = File.read(file);
            let isJsFile = info.ext == '.js';

            if (isJsFile) {
                //修正 require 引用的模块。
                let lines = Module.fixRequire(content, {
                    'name': info.name,
                    'name$id': name$id, //全局的包和对应的模块 id，如 { '@definejs/dialog': 'Dialog', }
                });

                let filename = path.relative(meta.dir, file); //如 `modules/Dialog/Template.js`。
                filename = path.join(meta.name, filename); //如 `@definejs/dialog/modules/Dialog/Template.js`

                content = Module.wrapDefine(sample, lines, {
                    'id': info.id,

                    //以下字段用于生成文件头的注释部分。
                    'file': filename,
                    'name': info.name,
                    'version': meta.version,
                    'author': meta.pkg.author,
                    'email': meta.pkg.email,
                    'package': meta.name,
                });

            }


            //指定了要输出目标文件。
            let destFile = '';

            if (dest) {
                destFile = $String.format(dest, {
                    'sname': meta.sname,
                    'name': meta.name,
                    'version': meta.version,
                    'id': info.id,
                    'ext': info.ext,
                });

                File.write(destFile, content);

            }

            if (isJsFile) {
                id$info[info.id] = Object.assign({}, info, {
                    'content': content,
                    'dest': destFile,
                    
                });
            }

            

        });

        return id$info;

    }
}

module.exports = Package;