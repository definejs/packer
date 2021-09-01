
const path = require('path');
const $String = require('@definejs/string');
const Lines = require('@definejs/lines');

const Require = require('./Module/Require');




//检查指定的行是否给注释掉了。
function checkCommented(line) {
    line = line.trimLeft();
    
    return line.startsWith('//') ||
        line.startsWith('/**') ||
        line.startsWith('*') ||
        line.startsWith('*/');
}


module.exports = {

    /**
     * 从模块的文件路径中解析出模块的名称等信息。
     * 模块的 id 是以大写字母开头的单词，如 `Alert/Dialog`。
     * @param {string} file 模块文件的路径。
     */
    parse(file) {
        //如 file = './temp/node_modules/@definejs/alert/modules/Alert/Dialog.js';
        //则 id = 'Alert/Dialog';

        let ext = path.extname(file).toLowerCase();         //后缀名，如 `.js`。
        let len = ext.length;
        let main = len > 0 ? file.slice(0, -len) : file;    //file 去掉后缀名。

        let names = main.split('/').filter((item, index) => { 
            return /^[A-Z]/.test(item);
        });

        let id = names.join('/');
        let name = names[names.length - 1]; //最后一项即为短名称。


        return {
            id,     //模块 id，即模块的完整名称，如 `Alert/Dialog`。
            name,   //模块名称，即模块的短名称，如 `Dialog`。
            names,  //模块完整名称的各个层级名称，如 ['Alert', 'Dialog']。
            file,   //模块所对应的原文件。
            ext,    //模块所对应的原文件的后缀名，如 `.js`。
            package: {//所在的包的信息。 这里先留空。

            },    
        };
        
        
    },

    /**
     * 修正 require 引用。
     * @param {string} 
     * @param {string} content 模块的 js 内容。
     * @param {Object} opt 选项。
     *  opt = {
     *      name: '',      //模块的短名称，如 `Alert/Dialog` 则为 `Dialog`。
     *      name$id: '',   //包名称对应的主模块 id，如 { '@definejs/alert': 'Alert', }。
     *  };
     */
    fixRequire(content, opt) {
        let lines = Lines.split(content);
        let patterns = Require.getFixPatterns(opt);


        lines = lines.map((line, index) => {
            line = '    ' + line; //顺便加上前导缩进。

            if (checkCommented(line)) {
                return line;
            }

            patterns.forEach((item) => { 
                line = line.replace(item.s0, item.s1);
            });

            return line;
        });


        return lines;

    },


    /**
     * 用 define() 包裹起来。
     * @param {Array} lines 模块的 js 分行内容。
     * @param {Object} info 模块的信息。
     */
    wrapDefine: function (sample, lines, info) {
        // lines = Lines.pad(lines, 4); //在每行前面填充 4 个空格。


        let content = $String.format(sample, {
            'id': info.id,
            'file': info.file,
            'package.name': info.package,
            'version': info.version,
            'name': info.name,
            'email': info.email,
            'file': info.file,
            'author.name': info.author.name,
            'content': Lines.join(lines),
        });


        return content;
    },
};