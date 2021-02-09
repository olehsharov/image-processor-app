require('dotenv').config();
const Queue = require('bee-queue');
const exportQueue = new Queue('export');
const ImageLibrary = require('./services/ImageLibrary');

(() => {
    console.log('Waiting for export jobs...')
    const library = new ImageLibrary(process.env.LIBRARY_FOLDER, process.env.EXPORT_FOLDER);
    exportQueue.process(process.env.WORKERS, async (job, done) => {
        console.log(`Exporting background ${job.id}: [${job.data.library}/${job.data.file}]`);
        await library.exportImage(job.data.library, job.data.file).catch(err => console.error(err))
        console.log('Done')
        return done(null, null);
    });
})()