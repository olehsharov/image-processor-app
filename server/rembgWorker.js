require('dotenv').config();
const Queue = require('bee-queue');
const importQueue = new Queue('rembg');
const ImageLibrary = require('./services/ImageLibrary');

(() => {
    console.log('Waiting for rembg jobs...')
    const library = new ImageLibrary(process.env.LIBRARY_FOLDER, process.env.EXPORT_FOLDER);
    importQueue.process(process.env.WORKERS, async (job, done) => {
        console.log(`Removing background ${job.id}: [${job.data.library}/${job.data.file}]`);
        await library.removeBackground(job.data.library, job.data.file).catch(err => console.error(err))
        console.log('Done')
        return done(null, null);
    });
})()