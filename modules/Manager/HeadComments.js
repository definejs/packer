
const $String = require('@definejs/string');
const $Date = require('@definejs/date')
const Lines = require('@definejs/lines');

function sortJSON(data) {
    if (Array.isArray(data)) {
        return data.sort();
    }

    let json = {};

    Object.keys(data).sort().forEach((key) => {
        json[key] = data[key]; 
    });

    return json;
}

module.exports = {
    render(content, name$id) {

        let now = $Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        let json = sortJSON(name$id);
        json = JSON.stringify(json, null, 4);
        json = Lines.pad(json, '* ', 1);


        content = $String.format(content, {
            '__build-time__': now,
            '__name$id__': json,
            '__packages-count__': Object.keys(name$id).length,
        });

        return content;

    },
};