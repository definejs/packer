
const $String = require('@definejs/string');

const beginTag = `//<!--GlobalExports.allowRequirePackage.begin-->`;
const endTag = `//<!--GlobalExports.allowRequirePackage.end-->`;


module.exports = {

    render(content, allow) { 
        let value = '';

        if (allow) {
            value = $String.between(content, beginTag, endTag);
        }

        content = $String.replaceBetween(content, {
            'begin': beginTag,
            'end': endTag,
            'value': value,
        });

        return content;


    },
};