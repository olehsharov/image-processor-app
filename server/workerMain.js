const child_process = require('child_process');
sleep = async (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
    while (true) {
        try {
            child_process.spawnSync("node server/worker.js",[], {
                shell: true,
                stdio: [process.stdin, process.stdout, process.stderr],
                encoding: 'utf-8'});
        } catch (err) {
            console.error('Worker error: ', err);
        }
        await sleep(1000);
    }
})();