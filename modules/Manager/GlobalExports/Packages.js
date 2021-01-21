
const $String = require('@definejs/string');
const $Object = require('@definejs/object');
const Lines = require('@definejs/lines');

const beginTag = '//<!--GlobalExports.packages.begin-->';
const endTag = '//<!--GlobalExports.packages.end-->';


function generate(name$id) {
    name$id = $Object.sort(name$id);

    let json = JSON.stringify(name$id, null, 4);
    let lines = Lines.split(json);

    lines = lines.slice(1, -1);

    lines = lines.map((item) => {
        item = item.trim();
        item = '        ' + item;
        item = item.split('"').join("'");

        return item.endsWith(',') ? item : item + ',';

    });

    lines = [
        `//原始包名对应的主模块。`,
        ...lines,
    ];

    return Lines.join(lines);
}


module.exports = {

    render(content, name$id) { 
        let value = generate(name$id);

        content = $String.replaceBetween(content, {
            'begin': beginTag,
            'end': endTag,
            'value': value,
        });


        return content;

    },
};