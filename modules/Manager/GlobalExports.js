
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


    render(content, globalExports, name$id) { 

        let code = getBindCode(content, globalExports.bind);

        content = $String.format(content, {
            '__global_exports_name__': globalExports.name,
            // '__global_exports_modules__': JSON.stringify(Object.values(name$id).sort(), null, 4),
        });

        content = $String.replaceBetween(content, {
            'begin': beginTag,
            'end': endTag,
            'value': code,
        });


        content = $String.replaceBetween(content, {
            'begin': '//<!--global.exports.modules.begin-->',
            'end': '//<!--global.exports.modules.end-->',

            'value': (function () {
                let ids = Object.values(name$id).sort();
                let json = JSON.stringify(ids, null, 4);

                // return json;

                let lines = Lines.split(json);

                lines = lines.slice(1, -1);
                lines = lines.map((item) => { 
                    item = item.trim();
                    item = '        ' + item;
                    item = item.split('"').join("'");
                    
                    return item.endsWith(',') ? item : item + ',';
                    
                });

                lines = [
                    `//外部可以通过 ${globalExports.name}.require(id) 进行使用的模块列表，共 ${ids.length} 个。`,
                    ...lines,
                ];
                
                return Lines.join(lines);

            })(),
        });

        return content;
    },
};