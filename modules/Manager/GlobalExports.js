
const $String = require('@definejs/string');
const Lines = require('@definejs/lines');

const beginTag = '    //<!--global.exports.bind.begin-->';
const endTag = '    //<!--global.exports.bind.end-->';


function getBindCode(content, name$item) {
    if (!name$item) {
        return '';
    }

    let sample = $String.between(content, beginTag, endTag);
    

    let lines = Object.keys(name$item).map((name) => {
        let item = name$item[name];

        //如 item = 'Mobile.Alert.show'; 
        //则解析为 item = { module: 'Mobile.Alert', method: 'show', };
        if (typeof item == 'string') {
            let a = item.split('.');

            item = {
                'module': a.slice(0, -1).join('.'),
                'method': a.slice(-1)[0],
            };
        }

        return $String.format(sample, {
            name,
            ...item,
        });
    });

    lines = Lines.split(lines);


    lines = lines.filter((line) => {
        return line.trim().length > 0;
    });


 
    return Lines.join(lines);
}


module.exports = {
    render(content, globalExports) { 

        let code = getBindCode(content, globalExports.bind);

        content = $String.format(content, {
            '__global_exports_name__': globalExports.name,
        });

        content = $String.replaceBetween(content, {
            'begin': beginTag,
            'end': endTag,
            'value': code,
        });


        return content;
    },
};