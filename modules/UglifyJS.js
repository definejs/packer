

const UglifyJS = require('uglify-es');
const $String = require('@definejs/string');
const File = require('@definejs/file');
const HintLine = require('@definejs/hint-line');

const Timer = require('./UglifyJS/Timer');


function getSize(content) {
    let size = $String.getByteLength(content);

    size = size / 1024;
    size = Math.ceil(size);

    return size;
}

function getPercent(size, size2) {
    let percent = (size - size2) / size * 100;

    percent = percent.toFixed(2);

    return percent;
}


module.exports = exports = {
    

    minify(opt) { 
        let { content, dest, } = opt;
        let size = getSize(content);

        Timer.start();
        console.log('开始压缩 js 内容', size.toString().cyan, 'KB'.gray, '...');


        //直接从内容压缩，不读取文件。
        let info = UglifyJS.minify(content, {
            
        }); 
        
        let { code, error, } = info;

        if (error) {
            console.error('js 压缩错误:');
            console.error(error);  //标红。

            HintLine.highlight(content, error.line - 1);
            File.write(opt.error, content);

            console.error(`已把压缩前的内容写入到  ${opt.error}，请根据错误提示进行检查。`);
            console.log(error); //这个可以把堆栈信息打印出来。

            throw error;
        }

        let size2 = getSize(code);
        let percent = getPercent(size, size2);
        let time = Timer.stop();


        console.log(
            '成功压缩 js 内容', size2.toString().cyan, 'KB'.gray,
            ' 压缩率', percent.toString().cyan + '%'.gray,
            ' 耗时', time.toString().cyan, 'ms'.gray
        );


        dest && File.write(dest, code); //写入压缩后的 js 文件。

    },


};