require('dotenv').config();
const ImageLibrary = require('./services/ImageLibrary');

sleep = async (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
    console.log('Checking for new images...');
    while (true) {
        var imageLibrary = new ImageLibrary(process.env.DATA_FOLDER);
        var images = imageLibrary.list().filter(f => !f.settings);
        if (images.length > 0) {
            console.log(`Processing ${images.length}`);
            for (i in images) {
                var image = images[i];
                await imageLibrary.process(image);
            }
            await sleep(1000);
        }
    }
})();