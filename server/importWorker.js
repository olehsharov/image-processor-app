require('dotenv').config();
const Queue = require('bee-queue');
const importQueue = new Queue('import');
const ImageLibrary = require('./services/ImageLibrary');

(() => {
    console.log('Waiting for import jobs...')
    const library = new ImageLibrary(process.env.LIBRARY_FOLDER, process.env.EXPORT_FOLDER);
    importQueue.process(async (job, done) => {
        console.log(`Importing ${job.id}: [${job.data.folder}]`);
        await library.importFolder(job.data.source, job.data.library).catch(err => console.error(err))
        console.log('Done')
        return done(null, null);
    });
})()