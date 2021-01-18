
const $String = require('@definejs/string');
const $Date = require('@definejs/date')
const $Object = require('@definejs/object');
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
        let id$name = {};

        $Object.each(name$id, (name, id) => {
            id$name[id] = name;
        });

        id$name = $Object.sort(id$name);
        id$name = JSON.stringify(id$name, null, 4);
        id$name = Lines.pad(id$name, '* ', 1);


        content = $String.format(content, {
            '__build-time__': now,
            '__id$name__': id$name,
            '__packages-count__': Object.keys(name$id).length,
        });

        return content;

    },
};