
const path = require('path');
const $String = require('@definejs/string');
const File = require('@definejs/file');
const Patterns = require('@definejs/patterns');
const Tasker = require('@definejs/tasker');
const Less = require('./Less/Less');



module.exports = {

    render(opt) { 
        let { patterns, dest, sample, minify, } = opt;
        let files = Patterns.getFiles(patterns);

        //没有 less 样式文件。
        if (!files.length) {
            return;
        }


        let tasker = new Tasker(files);

        sample = File.read(sample);

        tasker.on('each', function (file, index, done) {
            Less.compile({
                'src': file,
                'minify': minify,
                'done': function (css) { 
                    done({file, css, });
                },
            });
        });

        tasker.on('all', function (list) { 
            list = list.map((item, index) => {

                let file = item.file.split('@definejs')[1];

                return $String.format(sample, {
                    'file': '@definejs' + file,
                    'css': item.css,
                });
            });

            let content = list.join('\r\n');
            File.write(dest, content);
        });

        tasker.parallel();

    },
};