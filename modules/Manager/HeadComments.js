
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
    render(content, { name$id, name$pkg, }) {
        let now = $Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        let pid$mid = {};

        $Object.each(name$pkg, function (name, pkg) {
            let pid = pkg.id;
            let mid = name$id[name];

            pid$mid[pid] = mid;
        });

        pid$mid = $Object.sort(pid$mid);
        pid$mid = JSON.stringify(pid$mid, null, 4);
        pid$mid = Lines.pad(pid$mid, '* ', 1);


        content = $String.format(content, {
            '__build-time__': now,
            '__pid$mid__': pid$mid,
            '__packages-count__': Object.keys(pid$mid).length,
        });

        return content;

    },
};