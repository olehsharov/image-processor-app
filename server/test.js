const child_process = require('child_process');
const {flatten,times} = require('lodash');
var files = [];
for (var i = 0; i < 1000; i++) files.push(Math.random());

var gpus = 4;
var workers = 4

const process = (file, gpu) => {
    return new Promise((resolve, reject) => {
        console.log('Processing ', gpu, file)
        child_process.exec('sleep 1', function(error, stderr, stdout) {
            if (error) {
                console.error(stderr);
                reject()
            } else {
                console.log('Done ', file)
                console.log(stdout);
                resolve();
            }
        });
        
    });
}

(async () => {
    while (files.length > 0) {
        var jobs = times(workers, () => times(gpus, (gpu) => {
            return {
                gpu: gpu,
                file: files.pop()
            }
        }))
        await Promise.all(flatten(jobs)
            .filter(j => j.file)
            .map(j => process(j.file, j.gpu)));
    }
})();