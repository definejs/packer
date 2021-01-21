const $String = require('@definejs/string');
const Lines = require('@definejs/lines');


const beginTag = '    //<!--GlobalExports.bind.begin-->';
const endTag = '    //<!--GlobalExports.bind.end-->';


function generate(content, name$item) {
    if (!name$item) {
        return '';
    }

    let sample = $String.between(content, beginTag, endTag);


    let lines = Object.keys(name$item).map((name) => {
        let item = name$item[name];

        if (typeof item == 'function') {
            return `    exports['${name}'] = ${item.toString()};`;
        }

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

    render(content, name$item) { 
        let code = generate(content, name$item);

        content = $String.replaceBetween(content, {
            'begin': beginTag,
            'end': endTag,
            'value': code,
        });

        return content;


    },
};