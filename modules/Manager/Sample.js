

const File = require('@definejs/file');

const file$sample = {};


module.exports = {

    get(name, name$file) {
        let file = name$file[name] || name$file['*'];
        let sample = file$sample[file];

        if (sample) {
            return sample;
        }

        sample = File.read(file);
        sample = sample.replace('    //{content}', '{content}');
        
        file$sample[file] = sample;

        return sample;
    },
};