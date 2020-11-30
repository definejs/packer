
const less = require('less');
const $String = require('@definejs/string');
const File = require('@definejs/file');
const HintLine = require('@definejs/hint-line');

/**
* 修正 calc(express) 中的表达式计算，避免 less 引擎错误处理。
*
* 在 less 引擎编译 less 内容时，会对 calc(express) 中的表达式进行计算。
* 例如，原内容为 { width: calc(100% - 67px); }，如果不处理，
* 则 less 编译后为 { width: calc(33%); }，这并不是我们想要的结果。
* 通过本方法先把原内容变为 { width: calc(~"100% - 67px"); }
* 则编译后就是我们想要的 { width: calc(100% - 67px); }
* 即把 calc(express) 中的 express 提取出来，变为 ~"express" 即可。
*/
function fixCalc(content) {
    let list = content.match(/calc\([\s\S]*?\);/g);

    //没有要处理的规则。
    if (!list || list.length == 0) {
        return content;
    }

    list.map(function (oldS) {
        let value = $String.between(oldS, 'calc(', ');');

        if (!value) {
            return;
        }

        //已经是 calc(~"express"); 的结构。
        if (value.startsWith('~"') &&
            value.endsWith('"')) {
            return;
        }

        let newS = `calc(~"${value}");`;

        content = content.split(oldS).join(newS);
    });

    return content;
}


module.exports = {


    compile: function (opt) { 
        let { content, minify, src, dest, done, } = opt;

        minify = !!minify;
        content = content || File.read(src);
        content = fixCalc(content);


        less.render(content, { 'compress': minify, }, function (error, output) {
            if (error) {
                console.error('less 编译错误:', error.message);
                console.error(error); //标红。

                if (src) {
                    console.log('所在文件: '.bgCyan, src.cyan);
                }

                HintLine.highlight(content, error.line - 1);

                //console.log(error); //这个可以把堆栈信息打印出来。

                throw error;
            }


            let css = output.css;  // css可能为空内容。

            //非压缩版本，则重新美化一下格式。
            //less 输出的 css 是 2 个空格缩进的，这里换成 4 个空格。
            if (!minify) {
                css = css.split('\n  ').join('\r\n    ');
            }


            if (src) {
                console.log('编译'.green, src.cyan);

                if (!css) {
                    console.log('编译后的 css 内容为空'.red, src.red);
                }
            }

            if (dest) {
                File.write(dest, css);
            }


            done(css);
        });
    },
};