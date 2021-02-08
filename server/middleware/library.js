const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const Queue = require('bee-queue');
const ImageLibrary = require('../services/ImageLibrary');

var LIBRARY_FOLDER = process.env.LIBRARY_FOLDER;
var OUTPUT_FOLDER = process.env.OUTPUT_FOLDER;
var INPUT_FOLDER = process.env.INPUT_FOLDER;

const library = new ImageLibrary(LIBRARY_FOLDER, OUTPUT_FOLDER);
const importQueue = new Queue("import", { isWorker: false });

router.get("/api/libraries", (req, res) => {
    res.send(library.listLibraries());
})

router.post("/api/libraries", (req, res) => {
    res.send(library.createLibrary(req.body.name));

})
router.get("/api/libraries/:library/images", (req, res) => {
    res.send(library.listImages(req.params.library));
})
router.get("/api/libraries/:library/images/:image/thumbnail", (req, res) => {
    res.sendFile(library.thumbnail(req.params.library, req.params.image));
})
router.get("/api/libraries/:library/images/:image", (req, res) => {
    res.sendFile(library.image(req.params.library, req.params.image));
})
router.post("/api/libraries/:library/collections", (req, res) => {
    library.saveCollection(req.params.library, req.body.collection, req.body.files)
    res.sendStatus(200);
})

router.get("/api/input/*", (req, res) => {
    var queryPath = req.path.replace('/api/input/', '');
    var fullPath = path.join(INPUT_FOLDER, queryPath)
    if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
            var result = fs.readdirSync(fullPath).filter(f => !f.toLocaleLowerCase().startsWith('.')).map(f => {
                var stats = fs.statSync(path.join(fullPath, f));
                return {
                    name: f,
                    ...stats,
                    isFile: stats.isFile(),
                    isImage: (f.toLocaleLowerCase().endsWith('jpg') || f.toLocaleLowerCase().endsWith('jpeg') || f.toLocaleLowerCase().endsWith('png'))
                }
            })
            result = result.sort((a, b) => a.isFile ? 1 : -1);
            res.send(result)
        } else {
            res.sendFile(fullPath)
        }
    } else {
        res.send(404);
    }
})

router.post("/api/import/*", async (req, res) => {
    var queryPath = req.path.replace('/api/import/', '');
    var folder = path.join(INPUT_FOLDER, queryPath)
    if (fs.existsSync(folder)) {
        var job = importQueue.createJob({ source: folder,  library: req.body.library }).save()
        res.send(job);
    } else {
        res.send(404);
    }
})

module.exports = router;