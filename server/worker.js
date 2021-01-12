require('dotenv').config();
const ImageLibrary = require('./services/ImageLibrary');

const { times } = require('lodash');
const workers = process.env.WORKERS
;
(async () => {
    console.log('Checking for new images...');
    try {
        var imageLibrary = new ImageLibrary(process.env.DATA_FOLDER);
        var images = imageLibrary.list().filter(f => !f.settings);
        while (images.length > 0) {
            console.log(`Processing ${images.length}`);
            var jobs = times(workers, () => images.pop()).filter(img => img);
            await Promise.all(jobs.map(j => imageLibrary.process(j)));
        }
    } catch (err) {
        console.error('Error', err);
    }
})();