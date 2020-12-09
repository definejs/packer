

const File = require('@definejs/file');


module.exports = {

    //对 json 的键进行排序并写入 json 文件。
    write(file, data) {
        if (Array.isArray(data)) {
            let json = data.sort();
            File.writeJSON(file, json);
            return;
        }


        let json = {};

        Object.keys(data).sort().forEach((key) => {
            let value = data[key];

            //值为数组的，继续排序。
            if (Array.isArray(value)) {
                value = value.sort();
            }

            json[key] = value;
        });

        File.writeJSON(file, json);
    },
};