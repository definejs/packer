
const $String = require('@definejs/string');
const File = require('@definejs/file');
const Directory = require('@definejs/directory');
const Lines = require('@definejs/lines');

const InlineCode = require('./Third/InlineCode');
const Sample = require('./Third/Sample.js');



let meta = {
    ids: [],
    id$name: {},
    node_modules: '',
}

module.exports = exports = {

    parse({ id$version, id$name, node_modules, }) {
        meta.ids = Object.keys(id$version);
        meta.id$name = id$name || {};
        meta.node_modules = node_modules;
    },

    each(fn) { 
        let { ids, id$name, } = meta;
        let list = [];

        ids.forEach((id) => {
            let name = id$name[id];
            let value = fn(id, name);

            if (value !== null) {
                list.push(value);
            }
        });

        return list;
       
    },

    wrapDefine({ dest, sample, }) {
        let { node_modules, id$name, } = meta;

        sample = Sample.get(sample);


        let files = exports.each((id, name) => {
            //指定为 true，说明不需要包装处理。 
            //比如`font-awesome`，没有主文件。
            if (name === true) {
                return null;
            }

            let code = name ? `return global['${name}'];` ://如果指定了在全局的名称，则仅定义一个包装模块。 
                InlineCode.get(node_modules, id);  //否则，默认内联第三方库的代码，即整个第三方库的文件包含进来。 
            
            //说明没有主文件，比如 `font-awesome`。
            if (code === false) {
                id$name[id] = true; //标记为 true，以指示外面拷贝文件。
                return null;
            }

            code = Lines.pad(code, 4);

            let content = $String.format(sample, {
                'id': id,               //如 `jquery`。
                'code': code,
            });

            let file = $String.format(dest, {
                'id': id,
            });

            File.write(file, content);

            return file;
        });

        return files;

    },

    copy(outputDir) {
        let { node_modules, } = meta;

        //直接拷贝第三方依赖库整个目录。
        exports.each((id, name) => {

            //没有指定名称，说明已经内联，则不需要复制。
            if (!name) {
                return;
            }

            let src = `${node_modules}${id}/`;
            let dest = `${outputDir}${id}/`;

            Directory.copy(src, dest);
        });
    },



};