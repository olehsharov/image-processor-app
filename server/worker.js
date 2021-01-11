require('dotenv').config();
const ImageLibrary = require('./services/ImageLibrary');

sleep = async (ms) => new Promise(r => setTimeout(r, ms));
const { times, flatten } = require('lodash');
const workers = process.env.WORKERS
;
(async () => {
    console.log('Checking for new images...');
    while (true) {
        try {
            var imageLibrary = new ImageLibrary(process.env.DATA_FOLDER);
            var images = imageLibrary.list().filter(f => !f.settings);
            while (images.length > 0) {
                console.log(`Processing ${images.length}`);
    
                var jobs = times(workers, () => images.pop());
                await Promise.all(jobs.map(j => imageLibrary.process(j)));
    
                await sleep(1000);
            }
        } catch (err) {
            console.error('Error', err);
        }
    }
})();